import { NextResponse } from "next/server";
import { getHubSpotFormContext } from "@/utils/hubspotFormContext";
import { sendLeadNotification } from "@/utils/sendLeadNotification";

export const runtime = "nodejs";
export const maxDuration = 30;

const HUBSPOT_BASE_URL = "https://api.hubapi.com";
const HUBSPOT_FORMS_BASE_URL = "https://api.hsforms.com";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);
const SERVICE_OPTIONS = new Set([
  "Windscreen replacement",
  "Chip or crack repair",
  "ADAS camera recalibration",
  "Headlight polish",
  "Not sure—I need advice",
]);

class HubSpotRequestError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "HubSpotRequestError";
    this.status = status;
    this.details = details;
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

async function hubspotRequest(path, token, options = {}) {
  const response = await fetch(`${HUBSPOT_BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    cache: "no-store",
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new HubSpotRequestError(
      data.message || "HubSpot request failed",
      response.status,
      data,
    );
  }

  return data;
}

async function upsertContact(
  {
    email,
    firstname,
    phone,
    services_required,
    booking_date__time,
    hubspotMessage,
    message,
  },
  token,
) {
  const properties = {
    email,
    firstname,
    phone,
    services_required,
    ...(booking_date__time ? { booking_date__time } : {}),
    ...((hubspotMessage || message) ? { message: hubspotMessage || message } : {}),
  };
  const lookup = await fetch(
    `${HUBSPOT_BASE_URL}/crm/v3/objects/contacts/${encodeURIComponent(email)}?idProperty=email`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  if (lookup.ok) {
    const contact = await readJson(lookup);
    return hubspotRequest(`/crm/v3/objects/contacts/${contact.id}`, token, {
      method: "PATCH",
      body: JSON.stringify({ properties }),
    });
  }

  if (lookup.status !== 404) {
    const details = await readJson(lookup);
    throw new HubSpotRequestError(
      details.message || "Unable to look up HubSpot contact",
      lookup.status,
      details,
    );
  }

  return hubspotRequest("/crm/v3/objects/contacts", token, {
    method: "POST",
    body: JSON.stringify({ properties }),
  });
}

async function setContactPhoto(contactId, fileId, token) {
  return hubspotRequest(`/crm/v3/objects/contacts/${contactId}`, token, {
    method: "PATCH",
    body: JSON.stringify({
      properties: {
        windscreen_photo: String(fileId),
      },
    }),
  });
}

async function submitHubSpotForm({ fields, fileId, formId, portalId, request }) {
  const isBooking = fields.submission_type === "booking";
  const context = getHubSpotFormContext({
    request,
    submittedPageUri: fields.pageUri,
    fallbackPath: isBooking ? "/book-now" : "/send-photo",
    pageName: isBooking ? "Book AS Autoglass" : "Send a Photo",
  });
  const formFields = [
    ["firstname", fields.firstname],
    ["email", fields.email],
    ["phone", fields.phone],
    ["services_required", fields.services_required],
    ["message", fields.hubspotMessage || fields.message],
    ...(fileId ? [["windscreen_photo", String(fileId)]] : []),
    ...(fields.submission_type === "booking" && fields.booking_date__time
      ? [["booking_date__time", fields.booking_date__time]]
      : []),
  ].map(([name, value]) => ({
    objectTypeId: "0-1",
    name,
    value,
  }));
  const response = await fetch(
    `${HUBSPOT_FORMS_BASE_URL}/submissions/v3/integration/submit/${encodeURIComponent(portalId)}/${encodeURIComponent(formId)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submittedAt: String(Date.now()),
        fields: formFields,
        context,
      }),
      cache: "no-store",
    },
  );
  const data = await readJson(response);

  if (!response.ok) {
    throw new HubSpotRequestError(
      data.message || data.errors?.[0]?.message || "HubSpot form submission failed",
      response.status,
      data,
    );
  }

  return data;
}

async function uploadPhoto(photo, token) {
  const upload = new FormData();
  upload.append("file", photo, photo.name);
  upload.append(
    "folderPath",
    process.env.HUBSPOT_SEND_PHOTO_FOLDER || "/website-send-photo-leads",
  );
  upload.append(
    "options",
    JSON.stringify({
      access: "PRIVATE",
      overwrite: false,
      duplicateValidationStrategy: "NONE",
      duplicateValidationScope: "EXACT_FOLDER",
    }),
  );

  return hubspotRequest("/files/v3/files", token, {
    method: "POST",
    body: upload,
  });
}

function buildNoteBody(fields, photo) {
  const bookingDateTime = fields.booking_date__time
    ? new Intl.DateTimeFormat("en-NZ", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Pacific/Auckland",
      }).format(new Date(fields.booking_date__time))
    : "Not requested";
  const rows = [
    ["Service", fields.services_required],
    ["Vehicle registration", fields.registration || "Not provided"],
    ["Phone", fields.phone],
    ["Email", fields.email],
    ["Preferred date and time", bookingDateTime],
    ["Message", fields.message || "No additional message"],
    ["Original photo name", photo?.name || "No photo provided"],
    ["Landing page", fields.pageUri || "/send-photo"],
  ];

  return [
    "<h3>New send-photo website lead</h3>",
    ...rows.map(
      ([label, value]) => `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(value)}</p>`,
    ),
  ].join("");
}

async function attachLeadNote({ contactId, fileId, fields, photo }, token) {
  return hubspotRequest("/crm/v3/objects/notes", token, {
    method: "POST",
    body: JSON.stringify({
      properties: {
        hs_timestamp: new Date().toISOString(),
        hs_note_body: buildNoteBody(fields, photo),
        ...(fileId ? { hs_attachment_ids: String(fileId) } : {}),
      },
      associations: [
        {
          to: { id: String(contactId) },
          types: [
            {
              associationCategory: "HUBSPOT_DEFINED",
              associationTypeId: 202,
            },
          ],
        },
      ],
    }),
  });
}

function logHubSpotError(message, error) {
  console.error(message, {
    name: error?.name,
    status: error?.status,
    message: error?.message,
    category: error?.details?.category,
    correlationId: error?.details?.correlationId,
  });
}

function validateSubmission(fields, photo) {
  if (fields.website) return "spam";
  if (!SERVICE_OPTIONS.has(fields.services_required)) return "Choose a valid service.";
  if (fields.firstname.length < 2) return "Enter your first name.";
  if (!/^[+\d][\d\s()-]{7,}$/.test(fields.phone)) return "Enter a valid phone number.";
  if (!/^\S+@\S+\.\S+$/.test(fields.email)) return "Enter a valid email address.";
  // A preferred date is optional; only a supplied value has to make sense.
  if (fields.booking_date__time) {
    const preferredTime = new Date(fields.booking_date__time).getTime();
    if (Number.isNaN(preferredTime)) {
      return "Choose a valid preferred date and time.";
    }
    const currentMinute = Math.floor(Date.now() / 60000) * 60000;
    if (preferredTime < currentMinute) {
      return "Choose the current time or a future date and time.";
    }
  }
  if (photo) {
    if (!ACCEPTED_FILE_TYPES.has(photo.type)) return "Use a supported image format.";
    if (photo.size > MAX_FILE_SIZE) return "The photo must be smaller than 10 MB.";
  }
  return "";
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const fields = {
      services_required: String(formData.get("services_required") || "").trim(),
      firstname: String(formData.get("firstname") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      email: String(formData.get("email") || "").trim().toLowerCase(),
      registration: String(formData.get("registration") || "").trim().toUpperCase(),
      booking_date__time: String(formData.get("booking_date__time") || "").trim(),
      submission_type: String(formData.get("submission_type") || "photo_assessment").trim(),
      message: String(formData.get("message") || "").trim().slice(0, 1000),
      pageUri: String(formData.get("pageUri") || "").trim().slice(0, 500),
      website: String(formData.get("website") || "").trim(),
    };
    const photoField = formData.get("windscreen_photo");
    const photo =
      photoField instanceof File && photoField.size > 0 ? photoField : null;
    const validationError = validateSubmission(fields, photo);

    if (validationError === "spam") {
      return NextResponse.json({ success: true });
    }

    if (validationError) {
      return NextResponse.json(
        { success: false, message: validationError },
        { status: 400 },
      );
    }

    const readableBookingTime = fields.booking_date__time
      ? new Intl.DateTimeFormat("en-NZ", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "Pacific/Auckland",
        }).format(new Date(fields.booking_date__time))
      : "";
    fields.hubspotMessage = readableBookingTime
      ? `Preferred date and time: ${readableBookingTime}\n\n${fields.message || "No additional message"}`
      : fields.message;

    const token = process.env.HUBSPOT_PRIVATE_APP_TOKEN || process.env.HUBSPOT_API_KEY;
    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formId =
      fields.submission_type === "booking"
        ? process.env.NEXT_PUBLIC_HUBSPOT_GET_QUOTE_FORM_ID
        : process.env.NEXT_PUBLIC_HUBSPOT_SEND_PHOTO_FORM_ID;
    if (!token || !portalId || !formId) {
      console.error("HubSpot send-photo configuration is incomplete", {
        hasToken: Boolean(token),
        hasPortalId: Boolean(portalId),
        hasFormId: Boolean(formId),
      });
      return NextResponse.json(
        {
          success: false,
          message: "Photo sending is temporarily unavailable. Please call us instead.",
        },
        { status: 503 },
      );
    }

    const contact = await upsertContact(fields, token);
    let file = null;
    let photoUploadFailed = false;

    if (photo) {
      try {
        file = await uploadPhoto(photo, token);
        if (file) await setContactPhoto(contact.id, file.id, token);
      } catch (error) {
        photoUploadFailed = true;
        logHubSpotError("HubSpot photo upload failed; continuing without photo", error);
      }
    }

    await submitHubSpotForm({
      fields,
      fileId: file?.id,
      formId,
      portalId,
      request,
    });

    try {
      await attachLeadNote(
        {
          contactId: contact.id,
          fileId: file?.id,
          fields: {
            ...fields,
            message:
              photoUploadFailed && photo
                ? `${fields.message || "No additional message"}\n\nPhoto upload to HubSpot failed. Original filename: ${photo.name}`
                : fields.message,
          },
          photo,
        },
        token,
      );
    } catch (error) {
      logHubSpotError("HubSpot lead note attachment failed", error);
    }

    const isBooking = fields.submission_type === "booking";
    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "07 543 0009";
    const replyEmail = process.env.NEXT_PUBLIC_EMAIL || "";
    const notificationResults = await Promise.allSettled([
      sendLeadNotification({
        subject:
          isBooking
            ? `New booking request — ${fields.firstname}`
            : `New photo assessment — ${fields.firstname}`,
        replyTo: fields.email,
        attachment: photo,
        text: [
          isBooking
            ? "New AS Autoglass booking request"
            : "New AS Autoglass photo assessment",
          "",
          `Name: ${fields.firstname}`,
          `Email: ${fields.email}`,
          `Phone: ${fields.phone}`,
          `Service: ${fields.services_required}`,
          `Vehicle registration: ${fields.registration || "Not provided"}`,
          `Preferred date and time: ${readableBookingTime || "Not requested"}`,
          `Message: ${fields.message || "Not provided"}`,
          `Page: ${fields.pageUri || (isBooking ? "/book-now" : "/send-photo")}`,
          "",
          photo ? `Photo attached: ${photo.name}` : "No photo provided",
        ].join("\n"),
      }),
      sendLeadNotification({
        to: fields.email,
        subject: isBooking
          ? "We’ve received your booking request | AS Autoglass"
          : "We’ve received your photo | AS Autoglass",
        replyTo: replyEmail,
        text: [
          `Hi ${fields.firstname},`,
          "",
          isBooking
            ? `Thanks for requesting a booking with AS Autoglass. We’ve received your details${photo ? " and photo" : ""}. ${
                readableBookingTime
                  ? "Your requested time is not confirmed yet—our local team will contact you to confirm availability."
                  : "Our local team will contact you to arrange a time that suits you."
              }`
            : photo
              ? "Thanks for sending your photo to AS Autoglass. Our local team will review it and contact you with honest advice on the right next step."
              : "Thanks for your enquiry to AS Autoglass. Our local team will review your details and contact you with honest advice on the right next step.",
          "",
          `Service: ${fields.services_required}`,
          ...(isBooking && readableBookingTime
            ? [`Preferred date and time: ${readableBookingTime}`]
            : []),
          `Vehicle registration: ${fields.registration || "Not provided"}`,
          "",
          `If you need to speak with us sooner, call ${phoneNumber}.`,
          "",
          "AS Autoglass",
        ].join("\n"),
      }),
    ]);

    notificationResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          index === 0
            ? "Lead team notification failed"
            : "Lead customer confirmation failed",
          {
            status: result.reason?.status,
            message: result.reason?.message,
          },
        );
      }
    });

    return NextResponse.json(
      { success: true, photoUploadFailed },
      { status: 201 },
    );
  } catch (error) {
    logHubSpotError("HubSpot send-photo submission failed", error);

    const missingHubSpotScopes =
      error instanceof HubSpotRequestError && error.status === 403;

    return NextResponse.json(
      {
        success: false,
        message: missingHubSpotScopes
          ? "The HubSpot integration is missing required permissions. Please contact the site administrator."
          : "We couldn’t send your photo right now. Please try again or call us.",
      },
      { status: error instanceof HubSpotRequestError ? 502 : 500 },
    );
  }
}

import { NextResponse } from "next/server";
import { getHubSpotFormContext } from "@/utils/hubspotFormContext";
import { sendLeadNotification } from "@/utils/sendLeadNotification";

export const runtime = "nodejs";

const HUBSPOT_FORMS_BASE_URL = "https://api.hsforms.com";

async function readJson(response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function validate(fields) {
  if (fields.website) return "spam";
  if (fields.firstname.length < 2) return "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(fields.email)) return "Enter a valid email address.";
  if (fields.phone && !/^[+\d][\d\s()-]{7,}$/.test(fields.phone)) {
    return "Enter a valid phone number.";
  }
  return "";
}

export async function POST(request) {
  try {
    const body = await request.json();
    const fields = {
      firstname: String(body.firstname || "").trim().slice(0, 100),
      email: String(body.email || "").trim().toLowerCase().slice(0, 200),
      phone: String(body.phone || "").trim().slice(0, 50),
      message: String(body.message || "").trim().slice(0, 3000),
      pageUri: String(body.pageUri || "").trim().slice(0, 500),
      website: String(body.website || "").trim(),
    };
    const validationError = validate(fields);

    if (validationError === "spam") return NextResponse.json({ ok: true });
    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    const portalId = process.env.HUBSPOT_PORTAL_ID;
    const formId = process.env.NEXT_PUBLIC_HUBSPOT_CONTACT_US_FORM_ID;
    if (!portalId || !formId) {
      console.error("Contact form configuration is incomplete");
      return NextResponse.json(
        { message: "The contact form is temporarily unavailable. Please call us instead." },
        { status: 503 },
      );
    }

    const context = getHubSpotFormContext({
      request,
      submittedPageUri: fields.pageUri,
      fallbackPath: "/contact-us",
      pageName: "Contact AS Autoglass",
    });
    const response = await fetch(
      `${HUBSPOT_FORMS_BASE_URL}/submissions/v3/integration/submit/${encodeURIComponent(portalId)}/${encodeURIComponent(formId)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submittedAt: String(Date.now()),
          fields: [
            ["firstname", fields.firstname],
            ["email", fields.email],
            ["phone", fields.phone],
            ["message", fields.message],
          ].map(([name, value]) => ({ objectTypeId: "0-1", name, value })),
          context,
        }),
        cache: "no-store",
      },
    );
    const result = await readJson(response);

    if (!response.ok) {
      console.error("HubSpot contact form submission failed", {
        status: response.status,
        category: result.category,
        correlationId: result.correlationId,
        message: result.message || result.errors?.[0]?.message,
      });
      return NextResponse.json(
        { message: "We couldn’t send your message. Please try again or call us." },
        { status: 502 },
      );
    }

    const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER || "07 543 0009";
    const replyEmail = process.env.NEXT_PUBLIC_EMAIL || "";
    const notificationResults = await Promise.allSettled([
      sendLeadNotification({
        subject: `New contact enquiry — ${fields.firstname}`,
        replyTo: fields.email,
        text: [
          "New AS Autoglass contact enquiry",
          "",
          `Name: ${fields.firstname}`,
          `Email: ${fields.email}`,
          `Phone: ${fields.phone || "Not provided"}`,
          `Message: ${fields.message || "Not provided"}`,
          `Page: ${context.pageUri}`,
        ].join("\n"),
      }),
      sendLeadNotification({
        to: fields.email,
        subject: "We’ve received your enquiry | AS Autoglass",
        replyTo: replyEmail,
        text: [
          `Hi ${fields.firstname},`,
          "",
          "Thanks for getting in touch with AS Autoglass. We’ve received your enquiry and our local Tauranga team will review it shortly.",
          "",
          fields.message ? `Your message: ${fields.message}` : "",
          "",
          `If you need to speak with us sooner, call ${phoneNumber}.`,
          "",
          "AS Autoglass",
        ]
          .filter((line, index, lines) => line || lines[index - 1] !== "")
          .join("\n"),
      }),
    ]);

    notificationResults.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(
          index === 0
            ? "Contact team notification failed"
            : "Contact customer confirmation failed",
          {
            status: result.reason?.status,
            message: result.reason?.message,
          },
        );
      }
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form error", error);
    return NextResponse.json(
      { message: "We couldn’t send your message. Please try again or call us." },
      { status: 500 },
    );
  }
}

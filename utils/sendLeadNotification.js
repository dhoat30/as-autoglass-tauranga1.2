const DEFAULT_MAILGUN_API_URL = "https://api.mailgun.net";

function isValidEmail(value) {
  return /^\S+@\S+\.\S+$/.test(String(value || "").trim());
}

async function readResponse(response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function sendLeadNotification({
  subject,
  text,
  replyTo,
  attachment,
  to,
}) {
  const domain = process.env.MAILGUN_DOMAIN;
  const apiKey = process.env.MAILGUN_API_KEY;
  const from =
    process.env.MAILGUN_FROM_EMAIL ||
    `AS Autoglass Website <website@${domain}>`;
  const recipients = String(to || process.env.EMAIL_TO || "")
    .split(/[;,]/)
    .map((recipient) => recipient.trim())
    .filter(isValidEmail);

  if (!domain || !apiKey || recipients.length === 0) {
    throw new Error("Mailgun notification configuration is incomplete");
  }

  const message = new FormData();
  message.append("from", from);
  recipients.forEach((recipient) => message.append("to", recipient));
  message.append("subject", String(subject || "New website enquiry").slice(0, 180));
  message.append("text", String(text || "New website enquiry received."));

  if (isValidEmail(replyTo)) message.append("h:Reply-To", replyTo.trim());
  if (attachment instanceof File && attachment.size > 0) {
    message.append("attachment", attachment, attachment.name);
  }

  const apiBaseUrl = (
    process.env.MAILGUN_API_BASE_URL || DEFAULT_MAILGUN_API_URL
  ).replace(/\/$/, "");
  const response = await fetch(
    `${apiBaseUrl}/v3/${encodeURIComponent(domain)}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`api:${apiKey}`).toString("base64")}`,
      },
      body: message,
      cache: "no-store",
    },
  );
  const result = await readResponse(response);

  if (!response.ok) {
    const error = new Error(result.message || "Mailgun notification failed");
    error.status = response.status;
    throw error;
  }

  return result;
}

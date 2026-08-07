import { NextResponse } from "next/server";
import { sendLeadNotification } from "@/utils/sendLeadNotification";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim().slice(0, 5000);
    const formName = String(body.formName || "Website enquiry").trim();

    await sendLeadNotification({
      subject: formName,
      replyTo: email,
      text: message || "A new website enquiry was received.",
    });

    return NextResponse.json({ message: "Email sent", success: true });
  } catch (error) {
    console.error("Mailgun email failed", {
      status: error.status,
      message: error.message,
    });
    return NextResponse.json(
      { message: "Unable to send email", success: false },
      { status: error.status || 502 },
    );
  }
}

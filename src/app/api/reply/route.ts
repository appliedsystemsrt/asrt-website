import { NextRequest, NextResponse } from "next/server";
import { sendReplyEmail } from "@/lib/email";
import { addReply } from "@/lib/db";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { toEmail, toName, subject, message } = body;

  if (!toEmail || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const result = await sendReplyEmail(toEmail, toName || "User", subject, message);
  // Always save the reply record so admins can see what was sent (even if email failed)
  await addReply({ toEmail, toName: toName || "User", subject, message });

  if (result.success) {
    return NextResponse.json({ success: true, message: "Reply sent and saved." });
  }
  // Email failed but reply is saved — return success with a note
  return NextResponse.json({
    success: true,
    emailSent: false,
    message: "Reply saved. Email could not be sent (SMTP configuration issue).",
    emailError: result.error,
  });
}

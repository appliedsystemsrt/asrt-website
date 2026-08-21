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
  if (result.success) {
    await addReply({ toEmail, toName: toName || "User", subject, message });
  }
  return NextResponse.json(result, { status: result.success ? 200 : 502 });
}

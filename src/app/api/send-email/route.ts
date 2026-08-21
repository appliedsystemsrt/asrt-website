import { NextRequest, NextResponse } from "next/server";
import { addDemoRequest, getAdmin } from "@/lib/db";
import {
  sendContactNotification,
  sendDemoNotification,
  sendContactConfirmation,
  sendDemoConfirmation,
  isEmailConfigured,
} from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, data } = body;

  if (type !== "contact" && type !== "demo") {
    return NextResponse.json(
      { error: "Invalid email type. Use 'contact' or 'demo'." },
      { status: 400 }
    );
  }

  if (!data?.name || !data?.email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  if (type === "demo") {
    // addDemoRequest already inserts into the communications table
    await addDemoRequest(data);
  }

  const admin = await getAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "No admin registered. Please register first at /register_mail" },
      { status: 400 }
    );
  }

  if (!isEmailConfigured()) {
    console.log("[Email] SMTP not configured. Data saved to database but emails not sent.");
    // Return success so the form shows success — data is saved, just emails aren't sent
    return NextResponse.json({
      success: true,
      emailSent: false,
      message: "Submission saved. Email notifications disabled (SMTP not configured).",
    });
  }

  let result: { success: boolean; error?: string } = {
    success: false,
    error: "Invalid email type",
  };

  switch (type) {
    case "contact":
      result = await sendContactNotification(admin.email, data);
      if (data.email) {
        await sendContactConfirmation(data.email, data.name);
      }
      break;

    case "demo":
      result = await sendDemoNotification(admin.email, data);
      if (data.email) {
        await sendDemoConfirmation(data.email, data.name);
      }
      break;
  }

  return NextResponse.json({ success: true, emailSent: result.success, error: result.error });
}

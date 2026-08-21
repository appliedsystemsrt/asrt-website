import { NextRequest, NextResponse } from "next/server";
import { addCommunication, addDemoRequest, getAdmin } from "@/lib/db";
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
    addDemoRequest(data);
    addCommunication({
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      company: data.company || "",
      city: data.city || "",
      interest: data.interest ? `Demo request: ${data.interest}` : "Demo request",
      message: data.message || "Requested a product demonstration.",
      subscribeNewsletters: false,
      subscribeArticles: false,
      subscribeBlogs: false,
    });
  }

  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "No admin registered. Please register first at /register_mail" },
      { status: 400 }
    );
  }

  if (!isEmailConfigured()) {
    console.log("[Email] Not configured. Notification would be sent for type:", type);
    return NextResponse.json({
      success: false,
      error: "Email service not configured. Add RESEND_API_KEY to .env.local",
    });
  }

  let result: { success: boolean; error?: string } = {
    success: false,
    error: "Invalid email type",
  };

  switch (type) {
    case "contact":
      // Notify admin
      result = await sendContactNotification(admin.email, data);
      // Confirm to user
      if (data.email) {
        await sendContactConfirmation(data.email, data.name);
      }
      break;

    case "demo":
      // Notify admin
      result = await sendDemoNotification(admin.email, data);
      // Confirm to user
      if (data.email) {
        await sendDemoConfirmation(data.email, data.name);
      }
      break;

  }

  return NextResponse.json({ success: result.success, error: result.error });
}

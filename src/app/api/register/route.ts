import { NextRequest, NextResponse } from "next/server";
import { registerAdmin, getAdmin } from "@/lib/db";
import { sendWelcomeAdminEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, password, authMethod } = body;

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 }
    );
  }

  // Check if admin already registered
  const existing = getAdmin();
  if (existing) {
    return NextResponse.json(
      { error: "An admin account already exists. Only one admin is allowed in this testing environment." },
      { status: 409 }
    );
  }

  // Register admin
  const admin = registerAdmin({
    name,
    email,
    password: password || "",
    authMethod: authMethod || "manual",
  });

  // Send welcome email
  const emailResult = await sendWelcomeAdminEmail(admin.email, admin.name);

  return NextResponse.json({
    success: true,
    admin: { id: admin.id, name: admin.name, email: admin.email },
    welcomeEmailSent: emailResult.success,
  });
}

export async function GET() {
  const admin = getAdmin();
  if (!admin) {
    return NextResponse.json({ registered: false });
  }
  return NextResponse.json({
    registered: true,
    admin: { id: admin.id, name: admin.name, email: admin.email, authMethod: admin.authMethod },
  });
}

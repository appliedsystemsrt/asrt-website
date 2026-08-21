import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/db";

const FALLBACK_EMAIL = "iitrmit@gmail.com";
const FALLBACK_PASSWORD = "admin123";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  // Check fallback credentials
  if (email === FALLBACK_EMAIL && password === FALLBACK_PASSWORD) {
    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
    const response = NextResponse.json({ success: true, token });
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });
    return response;
  }

  // Check registered admin
  const admin = getAdmin();
  if (admin && admin.email === email) {
    // For manual registration, check password
    if (admin.authMethod === "manual" && admin.password !== password) {
      return NextResponse.json(
        { success: false, error: "Invalid password" },
        { status: 401 }
      );
    }
    // For Google auth, any password works (in production, verify via OAuth)
    if (admin.authMethod === "google" && password !== admin.password && password !== FALLBACK_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
    const response = NextResponse.json({ success: true, token });
    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 86400,
      path: "/",
    });
    return response;
  }

  return NextResponse.json(
    { success: false, error: "Invalid credentials" },
    { status: 401 }
  );
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin-token")?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  // Try to get admin name from stored admin
  const admin = getAdmin();
  const adminName = admin?.name || "Admin";
  return NextResponse.json({ authenticated: true, adminName });
}

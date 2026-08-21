import { NextRequest, NextResponse } from "next/server";
import { getAdminByEmail, getAdmin } from "@/lib/db";
import {
  getSupabaseAdminUser,
  isSupabaseConfigured,
  upgradeAdminPassword,
  verifyAdminPassword,
} from "@/lib/supabase";

const FALLBACK_EMAIL = "appliedsystems.rt@gmail.com";
const FALLBACK_PASSWORD = "Admin123";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  // Check fallback credentials
  if (!isSupabaseConfigured() && email === FALLBACK_EMAIL && password === FALLBACK_PASSWORD) {
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

  // Check the deployed Supabase admin when configured, otherwise use local JSON.
  if (isSupabaseConfigured()) {
    const admin = await getSupabaseAdminUser(email);
    if (admin && admin.email === email) {
      const passwordValid = verifyAdminPassword(password, admin.password_hash);
      if (!passwordValid) {
        return NextResponse.json(
          { success: false, error: "Invalid password" },
          { status: 401 }
        );
      }
      if (!admin.password_hash.includes(":")) {
        await upgradeAdminPassword(admin.id, password);
      }
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");
      const response = NextResponse.json({ success: true, token });
      response.cookies.set("admin-token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 86400,
        path: "/",
      });
      return response;
    }
  } else {
    const admin = getAdminByEmail(email);
    if (admin && admin.email === email) {
      const passwordValid = admin.password === password;
      if (!passwordValid) {
        return NextResponse.json(
          { success: false, error: "Invalid password" },
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
  const admin = isSupabaseConfigured()
    ? await getSupabaseAdminUser()
    : await getAdmin();
  const adminName = admin?.name || "Admin";
  return NextResponse.json({ authenticated: true, adminName });
}

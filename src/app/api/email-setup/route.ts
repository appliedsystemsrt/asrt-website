import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { saveSmtpConfig } from "@/lib/db";
import {
  getSupabaseSmtpConfig,
  isSupabaseConfigured,
  saveSupabaseSmtpConfig,
} from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { email, appPassword } = await req.json();

    if (!email || !appPassword) {
      return NextResponse.json(
        { error: "Email and app password are required" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Remove spaces from app password (Gmail format: xxxx xxxx xxxx xxxx)
    const cleanPassword = appPassword.replace(/\s/g, "");

    // Test SMTP connection
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: email,
        pass: cleanPassword,
      },
    });

    // Verify connection
    await transporter.verify();

    const smtpConfig = {
      host: "smtp.gmail.com",
      port: 587,
      user: email,
      pass: cleanPassword,
      from: email,
    };

    if (process.env.VERCEL && !isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Email verification succeeded, but Supabase is not configured on Vercel. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy.",
        },
        { status: 503 }
      );
    }

    // Vercel uses Supabase because its filesystem is read-only.
    if (isSupabaseConfigured()) {
      await saveSupabaseSmtpConfig(smtpConfig);
    } else {
      saveSmtpConfig(smtpConfig);
    }

    // Vercel has a read-only filesystem. Configure SMTP_USER, SMTP_PASS, and
    // SMTP_FROM in Vercel Environment Variables instead of writing .env.local.
    if (!process.env.VERCEL) {
      const envPath = path.join(process.cwd(), ".env.local");
      let envContent = fs.existsSync(envPath)
        ? fs.readFileSync(envPath, "utf-8")
        : "";
      const envLines = envContent.split("\n").filter(
        (line) =>
          !line.startsWith("SMTP_HOST=") &&
          !line.startsWith("SMTP_PORT=") &&
          !line.startsWith("SMTP_USER=") &&
          !line.startsWith("SMTP_PASS=") &&
          !line.startsWith("SMTP_FROM=")
      );
      envLines.push(
        "",
        "# Email Configuration (Gmail SMTP)",
        "SMTP_HOST=smtp.gmail.com",
        "SMTP_PORT=587",
        `SMTP_USER=${email}`,
        `SMTP_PASS=${cleanPassword}`,
        `SMTP_FROM=${email}`
      );
      fs.writeFileSync(envPath, envLines.join("\n"), "utf-8");
    }

    return NextResponse.json({
      success: true,
      message: "Email configured successfully",
      email: email,
    });
  } catch (error: any) {
    console.error("[Email Setup] Error:", error);

    // Provide helpful error messages
    let errorMessage = "Failed to configure email";

    if (error.code === "EAUTH") {
      errorMessage =
        "Authentication failed. Please check your email and app password. Make sure you've generated an app password in your Google Account settings.";
    } if (error.code === "ECONNREFUSED") {
      errorMessage =
        "Connection refused. Please check your internet connection.";
    } if (error.message?.includes("Invalid login")) {
      errorMessage =
        "Invalid login credentials. Please verify your Gmail address and app password are correct.";
    }

    const detail = typeof error?.message === "string" ? error.message : "";
    return NextResponse.json(
      { error: detail ? `${errorMessage}: ${detail}` : errorMessage },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    if (isSupabaseConfigured()) {
      const config = await getSupabaseSmtpConfig();
      return NextResponse.json({
        configured: Boolean(config?.user),
        email: config?.user || null,
      });
    }
    const { getSmtpConfig } = await import("@/lib/db");
    const config = getSmtpConfig();

    return NextResponse.json({
      configured: !!config,
      email: config?.user || null,
    });
  } catch {
    return NextResponse.json({ configured: false, email: null });
  }
}

import nodemailer from "nodemailer";
import path from "path";
import { getCommunications, getSmtpConfig, getSubscribers } from "./db";

const COMPANY_NAME = "Applied Systems Research and Technology OPC Private Ltd";
const LOGO_CID = "asrt-brand-logo";
const LOGO_PATH = path.join(process.cwd(), "public", "brand-logo.jpeg");
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://appliedaiml.com";

function emailLogo() {
  return `<img src="cid:${LOGO_CID}" alt="${COMPANY_NAME}" width="64" height="64" style="display:block;width:64px;height:64px;object-fit:contain;margin:0 auto;" />`;
}

// SMTP configuration - use admin settings first, then environment variables
function getSmtpSettings() {
  const dbConfig = getSmtpConfig();
  if (dbConfig?.user && dbConfig.pass) {
    return {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      pass: dbConfig.pass,
      from: dbConfig.from,
    };
  }

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    return {
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
    };
  }

  return null;
}

let transporter: nodemailer.Transporter | null = null;
let transporterKey = "";

function getTransporter() {
  const smtpSettings = getSmtpSettings();
  if (!smtpSettings?.user || !smtpSettings.pass) {
    console.log("[Email] SMTP not configured. Set SMTP_USER and SMTP_PASS in .env.local");
    return null;
  }

  const transporterConfig = {
    host: smtpSettings.host,
    port: smtpSettings.port,
    user: smtpSettings.user,
    pass: smtpSettings.pass,
    from: smtpSettings.from,
  };
  const nextTransporterKey = JSON.stringify(transporterConfig);

  if (transporter && transporterKey === nextTransporterKey) return transporter;

  transporter = nodemailer.createTransport({
    host: smtpSettings.host,
    port: smtpSettings.port,
    secure: smtpSettings.port === 465,
    auth: {
      user: smtpSettings.user,
      pass: smtpSettings.pass,
    },
  });
  transporterKey = nextTransporterKey;
  return transporter;
}

export function isEmailConfigured() {
  const smtpSettings = getSmtpSettings();
  return !!smtpSettings?.user && !!smtpSettings.pass;
}

async function sendMail(to: string, subject: string, html: string) {
  const smtpSettings = getSmtpSettings();
  const transport = getTransporter();
  if (!transport || !smtpSettings?.user || !smtpSettings.pass) {
    console.log("[Email] Not configured. Would send to:", to, "Subject:", subject);
    return { success: false, error: "SMTP not configured" };
  }
  try {
    await transport.sendMail({
      from: smtpSettings.from || smtpSettings.user,
      to,
      subject,
      html,
      attachments: [{ filename: "brand-logo.jpeg", path: LOGO_PATH, cid: LOGO_CID }],
    });
    console.log("[Email] Sent to:", to, "Subject:", subject);
    return { success: true };
  } catch (err) {
    console.error("[Email] Send failed:", err);
    return { success: false, error: String(err) };
  }
}

// ─── Admin welcome ───
export async function sendWelcomeAdminEmail(adminEmail: string, adminName: string) {
  return sendMail(
    adminEmail,
    `Welcome Admin — Access Granted | ${COMPANY_NAME}`,
    `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:40px auto;background:#0B1017;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <div style="padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05);">
        ${emailLogo()}
      </div>
      <div style="padding:32px;">
        <h1 style="color:#E8ECF1;font-size:24px;margin:0 0 8px;">Welcome, ${adminName}!</h1>
        <p style="color:#FF7200;font-size:14px;margin:0 0 24px;font-family:monospace;letter-spacing:0.05em;">ACCESS GRANTED</p>
        <p style="color:rgba(232,236,241,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;">
          Your admin account has been successfully registered for <strong style="color:rgba(232,236,241,0.8);">${COMPANY_NAME}</strong>.
        </p>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin:24px 0;">
          <p style="color:rgba(232,236,241,0.4);font-size:11px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px;">Admin Email</p>
          <p style="color:#E8ECF1;font-size:15px;margin:0;">${adminEmail}</p>
        </div>
      </div>
    </div>`
  );
}

// ─── Contact notification to admin ───
export async function sendContactNotification(
  adminEmail: string,
  data: { name: string; email: string; phone: string; company: string; city: string; interest: string; message: string }
) {
  return sendMail(
    adminEmail,
    `New Contact Form Submission — ${data.name}`,
    `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:40px auto;background:#0B1017;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <div style="padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.05);">
        ${emailLogo()}
        <h2 style="color:#E8ECF1;font-size:18px;margin:0;">New Contact Submission</h2>
        <p style="color:rgba(232,236,241,0.4);font-size:12px;margin:4px 0 0;font-family:monospace;">${COMPANY_NAME}</p>
      </div>
      <div style="padding:24px 32px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Name</p><p style="color:#E8ECF1;font-size:14px;margin:0;">${data.name}</p></div>
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Email</p><p style="color:#FF7200;font-size:14px;margin:0;">${data.email}</p></div>
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Phone</p><p style="color:#E8ECF1;font-size:14px;margin:0;">${data.phone || "Not provided"}</p></div>
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Company</p><p style="color:#E8ECF1;font-size:14px;margin:0;">${data.company || "Not provided"}</p></div>
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">City</p><p style="color:#E8ECF1;font-size:14px;margin:0;">${data.city || "Not provided"}</p></div>
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Interest</p><p style="color:#E8ECF1;font-size:14px;margin:0;">${data.interest || "Not specified"}</p></div>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:16px;">
          <p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px;">Message</p>
          <p style="color:rgba(232,236,241,0.7);font-size:14px;line-height:1.6;margin:0;">${data.message}</p>
        </div>
      </div>
    </div>`
  );
}

// ─── Demo notification to admin ───
export async function sendDemoNotification(
  adminEmail: string,
  data: { name: string; email: string; company: string; phone: string; interest: string; message: string }
) {
  return sendMail(
    adminEmail,
    `New Demo Request — ${data.name}`,
    `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:40px auto;background:#0B1017;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <div style="padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.05);">
        ${emailLogo()}
        <h2 style="color:#E8ECF1;font-size:18px;margin:0;">New Demo Request</h2>
        <p style="color:rgba(232,236,241,0.4);font-size:12px;margin:4px 0 0;font-family:monospace;">${COMPANY_NAME} — Book a Demo</p>
      </div>
      <div style="padding:24px 32px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:24px;">
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Name</p><p style="color:#E8ECF1;font-size:14px;margin:0;">${data.name}</p></div>
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Email</p><p style="color:#FF7200;font-size:14px;margin:0;">${data.email}</p></div>
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Company</p><p style="color:#E8ECF1;font-size:14px;margin:0;">${data.company || "Not provided"}</p></div>
          <div><p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 4px;">Phone</p><p style="color:#E8ECF1;font-size:14px;margin:0;">${data.phone || "Not provided"}</p></div>
        </div>
        <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:10px;padding:16px;">
          <p style="color:rgba(232,236,241,0.3);font-size:10px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 8px;">Message</p>
          <p style="color:rgba(232,236,241,0.7);font-size:14px;line-height:1.6;margin:0;">${data.message || "No additional details provided."}</p>
        </div>
      </div>
    </div>`
  );
}

// ─── Contact confirmation to user ───
export async function sendContactConfirmation(userEmail: string, userName: string) {
  return sendMail(
    userEmail,
    `We received your message — ${COMPANY_NAME}`,
    `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:40px auto;background:#0B1017;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <div style="padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05);">
        ${emailLogo()}
      </div>
      <div style="padding:32px;">
        <h1 style="color:#E8ECF1;font-size:22px;margin:0 0 16px;">Thank you, ${userName}!</h1>
        <p style="color:rgba(232,236,241,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;">
          We have received your message and our team will get back to you shortly.
        </p>
        <p style="color:rgba(232,236,241,0.3);font-size:12px;margin:24px 0 0;line-height:1.6;">
          ${COMPANY_NAME}<br>Bangalore, Karnataka, India
        </p>
      </div>
    </div>`
  );
}

// ─── Demo confirmation to user ───
export async function sendDemoConfirmation(userEmail: string, userName: string) {
  return sendMail(
    userEmail,
    `Demo Request Received — ${COMPANY_NAME}`,
    `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:40px auto;background:#0B1017;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <div style="padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05);">
        ${emailLogo()}
      </div>
      <div style="padding:32px;">
        <h1 style="color:#E8ECF1;font-size:22px;margin:0 0 16px;">Demo Request Received!</h1>
        <p style="color:rgba(232,236,241,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;">
          Hi ${userName}, thank you for your interest in seeing our technology in action.
        </p>
        <p style="color:rgba(232,236,241,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;">
          Our team will reach out to you soon to schedule a personalized demo session.
        </p>
        <p style="color:rgba(232,236,241,0.3);font-size:12px;margin:24px 0 0;line-height:1.6;">
          ${COMPANY_NAME}<br>Bangalore, Karnataka, India
        </p>
      </div>
    </div>`
  );
}

// ─── Reply to communication ───
export async function sendReplyEmail(toEmail: string, toName: string, subject: string, message: string) {
  return sendMail(
    toEmail,
    subject,
    `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:40px auto;background:#0B1017;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
      <div style="padding:24px 32px;border-bottom:1px solid rgba(255,255,255,0.05);">
        ${emailLogo()}
        <h2 style="color:#E8ECF1;font-size:18px;margin:0;">Reply from ${COMPANY_NAME}</h2>
        <p style="color:rgba(232,236,241,0.4);font-size:12px;margin:4px 0 0;font-family:monospace;">${COMPANY_NAME}</p>
      </div>
      <div style="padding:24px 32px;">
        <p style="color:rgba(232,236,241,0.6);font-size:15px;line-height:1.7;margin:0 0 16px;">Hi ${toName},</p>
        <div style="color:rgba(232,236,241,0.7);font-size:15px;line-height:1.7;margin:0 0 24px;white-space:pre-wrap;">${message}</div>
        <p style="color:rgba(232,236,241,0.4);font-size:13px;margin:24px 0 0;line-height:1.6;">
          Best regards,<br>${COMPANY_NAME}
        </p>
      </div>
    </div>`
  );
}

export async function notifySubscribers(post: {
  id: string;
  type: "blog" | "article" | "newsletter";
  title: string;
  excerpt: string;
}) {
  const storedSubscribers = getSubscribers();
  const historicalSubscribers = getCommunications().filter(
    (communication) =>
      communication.subscribeNewsletters ||
      communication.subscribeArticles ||
      communication.subscribeBlogs
  );
  const subscribers = [
    ...storedSubscribers,
    ...historicalSubscribers.map((communication) => ({
      name: communication.name,
      email: communication.email,
      phone: communication.phone,
      city: communication.city,
      subscribeNewsletters: communication.subscribeNewsletters,
      subscribeArticles: communication.subscribeArticles,
      subscribeBlogs: communication.subscribeBlogs,
      createdAt: communication.createdAt,
    })),
  ].filter((subscriber, index, all) =>
    all.findIndex((candidate) => candidate.email.toLowerCase() === subscriber.email.toLowerCase()) === index
  ).filter((subscriber) => {
    if (post.type === "newsletter") return subscriber.subscribeNewsletters;
    if (post.type === "article") return subscriber.subscribeArticles;
    return subscriber.subscribeBlogs;
  });

  const postUrl = `${SITE_URL}/blog?post=${encodeURIComponent(post.id)}`;
  const label = post.type === "newsletter" ? "newsletter" : post.type;
  const results = await Promise.all(
    subscribers.map((subscriber) =>
      sendMail(
        subscriber.email,
        `New ${label}: ${post.title}`,
        `<div style="font-family:system-ui,sans-serif;max-width:600px;margin:40px auto;background:#0B1017;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
          <div style="padding:32px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05);">
            ${emailLogo()}
            <p style="color:rgba(232,236,241,0.4);font-size:12px;margin:16px 0 0;font-family:monospace;">${COMPANY_NAME}</p>
          </div>
          <div style="padding:32px;">
            <p style="color:#FF7200;font-size:12px;margin:0 0 12px;font-family:monospace;letter-spacing:0.1em;text-transform:uppercase;">New ${label}</p>
            <h1 style="color:#E8ECF1;font-size:24px;line-height:1.3;margin:0 0 16px;">${post.title}</h1>
            <p style="color:rgba(232,236,241,0.6);font-size:15px;line-height:1.7;margin:0 0 24px;">${post.excerpt || "Read the latest from our applied research and technology team."}</p>
            <a href="${postUrl}" style="display:inline-block;background:#FF7200;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-size:14px;font-weight:600;">View ${label}</a>
          </div>
        </div>`
      ).then((result) => ({ email: subscriber.email, ...result }))
    )
  );
  return {
    matched: subscribers.length,
    sent: results.filter((result) => result.success).length,
    failed: results.filter((result) => !result.success),
  };
}

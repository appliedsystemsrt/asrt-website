import crypto from "crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  if (!client) {
    client = createClient(url, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return client;
}

export function hashAdminPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyAdminPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return storedHash === password;
  const expected = Buffer.from(hash, "hex");
  const actual = crypto.scryptSync(password, salt, 64);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "asrt-local-session-secret"
  );
}

export function createAdminSessionToken(email: string) {
  const payload = `${email}:${Date.now()}`;
  const signature = crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function getAdminSessionEmail(token: string) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const separator = decoded.lastIndexOf(":");
    const payload = decoded.slice(0, separator);
    const signature = decoded.slice(separator + 1);
    const expected = crypto
      .createHmac("sha256", sessionSecret())
      .update(payload)
      .digest("hex");
    if (!signature || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
      return null;
    }
    const payloadSeparator = payload.lastIndexOf(":");
    const email = payload.slice(0, payloadSeparator);
    const createdAt = Number(payload.slice(payloadSeparator + 1));
    if (!email || !Number.isFinite(createdAt) || Date.now() - createdAt > 86400000) {
      return null;
    }
    return email;
  } catch {
    return null;
  }
}

export async function upgradeAdminPassword(id: string, password: string) {
  const { error } = await getSupabaseAdmin()
    .from("admins")
    .update({ password_hash: hashAdminPassword(password), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function getSupabaseAdminUser(email?: string) {
  let query = getSupabaseAdmin()
    .from("admins")
    .select("id,email,password_hash,name,created_at");
  if (email) query = query.eq("email", email);
  const { data, error } = await query.limit(1).maybeSingle();
  if (error) throw error;
  return data;
}

export async function registerSupabaseAdmin(input: {
  name: string;
  email: string;
  password: string;
}) {
  const { data, error } = await getSupabaseAdmin()
    .from("admins")
    .insert({
      name: input.name,
      email: input.email,
      password_hash: hashAdminPassword(input.password),
    })
    .select("id,email,name,created_at")
    .single();
  if (error) throw error;
  return data;
}

export async function saveSupabaseSmtpConfig(config: {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}) {
  const supabase = getSupabaseAdmin();
  const existing = await supabase
    .from("smtp_settings")
    .select("id")
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (existing.error) throw existing.error;

  const values = {
    host: config.host,
    port: config.port,
    username: config.user,
    password_encrypted: config.pass,
    from_email: config.from,
    status: "active",
    updated_at: new Date().toISOString(),
  };
  const result = existing.data
    ? await supabase.from("smtp_settings").update(values).eq("id", existing.data.id)
    : await supabase.from("smtp_settings").insert(values);
  if (result.error) throw result.error;
}

export async function getSupabaseSmtpConfig() {
  const { data, error } = await getSupabaseAdmin()
    .from("smtp_settings")
    .select("username,from_email,status")
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data
    ? { user: data.username || "", from: data.from_email || "" }
    : null;
}

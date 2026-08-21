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

export async function upgradeAdminPassword(id: string, password: string) {
  const { error } = await getSupabaseAdmin()
    .from("admins")
    .update({ password_hash: hashAdminPassword(password), updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw error;
}

export async function getSupabaseAdminUser() {
  const { data, error } = await getSupabaseAdmin()
    .from("admins")
    .select("id,email,password_hash,name,created_at")
    .limit(1)
    .maybeSingle();
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

import fs from "fs";
import path from "path";
import { getSupabaseAdmin } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");

let _supabaseReady: boolean | null = null;

async function isSupabaseReady(): Promise<boolean> {
  if (_supabaseReady !== null) return _supabaseReady;
  const envReady = Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  if (!envReady) {
    _supabaseReady = false;
    return false;
  }
  try {
    const { error } = await getSupabaseAdmin()
      .from("communications")
      .select("id")
      .limit(1);
    _supabaseReady = !error || !isTableMissingError(error);
    if (!_supabaseReady) {
      console.warn("[DB] Supabase tables not found — falling back to local JSON storage.");
      console.warn("[DB] Run the SQL migration in Supabase SQL Editor to enable Supabase storage.");
    }
    return _supabaseReady;
  } catch {
    _supabaseReady = false;
    return false;
  }
}

/** Synchronous check — true only if env vars present (for callers that can't await) */
function shouldUseSupabase() {
  return Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function isTableMissingError(error: any): boolean {
  if (!error) return false;
  const msg = (error.message || error.details || error.hint || "").toLowerCase();
  return (
    msg.includes("does not exist") ||
    msg.includes("relation \"public.") ||
    msg.includes("not found") ||
    error.code === "42P01" // undefined_table
  );
}

/** True if the error is a PostgREST schema cache issue (column not in cache) */
function isSchemaCacheError(error: any): boolean {
  if (!error) return false;
  return error.code === "PGRST204" || (error.message || "").includes("PGRST204");
}

/** Reset the Supabase ready cache so next probe re-checks */
export function resetSupabaseCache() {
  _supabaseReady = null;
}

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(file: string, defaultVal: T): T {
  ensureDataDir();
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) {
    fs.writeFileSync(fp, JSON.stringify(defaultVal, null, 2));
    return defaultVal;
  }
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

function writeJSON<T>(file: string, data: T) {
  ensureDataDir();
  const fp = path.join(DATA_DIR, file);
  fs.writeFileSync(fp, JSON.stringify(data, null, 2));
}

// ─── Types ───

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  createdAt: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  overview: string;
  problem: string;
  intelligence: string;
  modules: string;
  architecture: string;
  technology: string;
  security: string;
  performance: string;
  testing: string;
  roadmap: string;
  screens?: string;
  research?: string;
  workflow?: string;
  differentiation?: string;
  tags: string[];
  image: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  type: "blog" | "article" | "newsletter";
  title: string;
  author: string;
  content: string;
  excerpt: string;
  coverImage: string;
  pdfUrl: string;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface Newsletter extends Blog {
  newsletterDate: string;
  photos: string[];
}

export interface Communication {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  city: string;
  interest: string;
  message: string;
  subscribeNewsletters: boolean;
  subscribeArticles: boolean;
  subscribeBlogs: boolean;
  createdAt: string;
  read: boolean;
}

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  subscribeNewsletters: boolean;
  subscribeArticles: boolean;
  subscribeBlogs: boolean;
  createdAt: string;
}

export interface DemoRequest {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  interest: string;
  message: string;
  createdAt: string;
}

export interface ReplyRecord {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  authMethod: "google" | "manual";
  createdAt: string;
}

// ─── Default data ───

const DEFAULT_TEAMS: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Anandhi",
    role: "Founder & Research Director",
    bio: "Leading applied AI research with a focus on bridging academic innovation and real-world systems.",
    image: "/dr-anandhi.png",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Dr. Anasuya Devi",
    role: "Head of AI & Machine Learning",
    bio: "Specializing in machine learning architectures and generative AI systems for complex engineering challenges.",
    image: "/dr-anasuya-devi.png",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "1",
    slug: "jarvis",
    name: "JARVIS AI",
    tagline: "AI Business Analyst for Intelligent Commerce",
    description:
      "JARVIS brings transactional, inventory and behavioral data together with generative AI to produce structured business intelligence.",
    overview: "",
    problem: "",
    intelligence: "",
    modules: "",
    architecture: "",
    technology: "",
    security: "",
    performance: "",
    testing: "",
    roadmap: "",
    tags: ["AI", "Commerce", "Business Intelligence"],
    image: "",
    createdAt: new Date().toISOString(),
  },
];

// ─── Teams ───

export async function getTeams(): Promise<TeamMember[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("teams")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) throw error;
    const rows = data || [];
    // Seed default team members if they don't already exist
    for (const member of DEFAULT_TEAMS) {
      const exists = rows.some((r: any) => r.name === member.name);
      if (!exists) {
        await getSupabaseAdmin().from("teams").insert({
          name: member.name,
          slug: `${member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
          description: member.bio,
          metadata: { role: member.role, bio: member.bio, image: member.image },
        });
      }
    }
    // Re-fetch after potential seeding
    const { data: final } = await getSupabaseAdmin()
      .from("teams")
      .select("*")
      .order("created_at", { ascending: true });
    return (final || []).map((row: any) => ({
      id: String(row.id),
      name: row.name,
      role: row.metadata?.role || "",
      bio: row.metadata?.bio || row.description || "",
      image: row.metadata?.image || "",
      createdAt: row.created_at,
    }));
  }
  return readJSON<TeamMember[]>("teams.json", DEFAULT_TEAMS);
}

export function saveTeams(teams: TeamMember[]) {
  writeJSON("teams.json", teams);
}export async function addTeam(
  member: Omit<TeamMember, "id" | "createdAt">
): Promise<TeamMember> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("teams")
      .insert({
        name: member.name,
        slug: `${member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        description: member.bio,
        metadata: member,
      })
      .select()
      .single();
    if (error) throw error;
    return { ...member, id: String(data.id), createdAt: data.created_at };
  }
  const teams = await getTeams();
  const newMember: TeamMember = {
    ...member,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
  };
  teams.push(newMember);
  saveTeams(teams);
  return newMember;
}

export async function deleteTeam(id: string): Promise<boolean> {
  if (await isSupabaseReady()) {
    const { error, count } = await getSupabaseAdmin()
      .from("teams")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    return Boolean(count);
  }
  const teams = await getTeams();
  const filtered = teams.filter((t) => t.id !== id);
  if (filtered.length === teams.length) return false;
  saveTeams(filtered);
  return true;
}

// ─── Products ───

export async function getProducts(): Promise<Product[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const rows = data || [];
    // Seed default products if they don't already exist
    for (const product of DEFAULT_PRODUCTS) {
      const exists = rows.some((r: any) => r.slug === product.slug);
      if (!exists) {
        await getSupabaseAdmin().from("products").insert({
          name: product.name,
          slug: product.slug,
          description: product.description,
          metadata: product,
        });
      }
    }
    // Re-fetch after potential seeding
    const { data: final } = await getSupabaseAdmin()
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    return (final || []).map((row: any) => ({
      ...row.metadata,
      id: String(row.id),
      name: row.name,
      slug: row.slug,
      description: row.description || "",
      image: row.metadata?.image || "",
      tags: row.metadata?.tags || [],
      createdAt: row.created_at,
    }));
  }
  return readJSON<Product[]>("products.json", DEFAULT_PRODUCTS);
}

export function saveProducts(products: Product[]) {
  writeJSON("products.json", products);
}

export async function addProduct(
  product: Omit<Product, "id" | "createdAt">
): Promise<Product> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("products")
      .insert({
        name: product.name,
        slug: product.slug,
        description: product.description,
        metadata: product,
      })
      .select()
      .single();
    if (error) throw error;
    return { ...product, id: String(data.id), createdAt: data.created_at };
  }
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
  };
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

export async function deleteProduct(id: string): Promise<boolean> {
  if (await isSupabaseReady()) {
    const { error, count } = await getSupabaseAdmin()
      .from("products")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    return Boolean(count);
  }
  const products = await getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

// ─── Blogs ───

export async function getBlogs(): Promise<Blog[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) => ({
      ...row.metadata,
      id: String(row.id),
      title: row.title,
      excerpt: row.excerpt || "",
      content:
        typeof row.content === "string"
          ? row.content
          : row.metadata?.content || "",
      coverImage: row.cover_image_url || "",
      createdAt: row.created_at,
      updatedAt: row.updated_at || row.created_at,
      readTime: row.metadata?.readTime || 1,
      type: row.metadata?.type || "blog",
      author: row.metadata?.author || "ASRT Team",
      pdfUrl: row.metadata?.pdfUrl || "",
    }));
  }
  return readJSON<Blog[]>("blogs.json", []);
}

export function saveBlogs(blogs: Blog[]) {
  writeJSON("blogs.json", blogs);
}

export async function addBlog(
  blog: Omit<Blog, "id" | "createdAt" | "updatedAt" | "readTime">
): Promise<Blog> {
  if (await isSupabaseReady()) {
    const readTime = Math.max(
      1,
      Math.ceil(
        blog.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200
      )
    );
    const { data, error } = await getSupabaseAdmin()
      .from("blogs")
      .insert({
        title: blog.title,
        slug: `${blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`,
        excerpt: blog.excerpt,
        content: JSON.stringify(blog.content),
        cover_image_url: blog.coverImage,
        status: "published",
        metadata: {
          type: blog.type,
          author: blog.author,
          pdfUrl: blog.pdfUrl,
          readTime,
        },
      })
      .select()
      .single();
    if (error) throw error;
    return {
      ...blog,
      id: String(data.id),
      readTime,
      createdAt: data.created_at,
      updatedAt: data.updated_at || data.created_at,
    };
  }
  const blogs = await getBlogs();
  const wordCount = blog.content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const newBlog: Blog = {
    ...blog,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    readTime: Math.max(1, Math.ceil(wordCount / 200)),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  blogs.unshift(newBlog);
  saveBlogs(blogs);
  return newBlog;
}

export async function deleteBlog(id: string): Promise<boolean> {
  if (await isSupabaseReady()) {
    const { error, count } = await getSupabaseAdmin()
      .from("blogs")
      .delete({ count: "exact" })
      .eq("id", id);
    if (error) throw error;
    return Boolean(count);
  }
  const blogs = await getBlogs();
  const filtered = blogs.filter((b) => b.id !== id);
  if (filtered.length === blogs.length) return false;
  saveBlogs(filtered);
  return true;
}

// ─── Communications ───

export async function getCommunications(): Promise<Communication[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("communications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: String(row.id),
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
      company: row.company || "",
      city: row.city || "",
      interest: row.interest || "",
      message: row.message || "",
      subscribeNewsletters: row.metadata?.subscribeNewsletters || false,
      subscribeArticles: row.metadata?.subscribeArticles || false,
      subscribeBlogs: row.metadata?.subscribeBlogs || false,
      createdAt: row.created_at,
      read: row.read || false,
    }));
  }
  return readJSON<Communication[]>("communications.json", []);
}

export async function saveCommunications(comms: Communication[]) {
  writeJSON("communications.json", comms);
}

export async function addCommunication(
  comm: Omit<Communication, "id" | "createdAt" | "read">
): Promise<Communication> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("communications")
      .insert({
        name: comm.name,
        email: comm.email,
        phone: comm.phone,
        company: comm.company,
        city: comm.city,
        interest: comm.interest,
        message: comm.message,
        read: false,
        metadata: {
          subscribeNewsletters: comm.subscribeNewsletters,
          subscribeArticles: comm.subscribeArticles,
          subscribeBlogs: comm.subscribeBlogs,
        },
      })
      .select()
      .single();
    if (error) {
      if (isSchemaCacheError(error) || isTableMissingError(error)) {
        console.warn("[DB] Supabase insert failed (schema cache), falling back to local JSON");
        _supabaseReady = null;
      } else {
        throw error;
      }
    } else {
      return {
        ...comm,
        id: String(data.id),
        createdAt: data.created_at,
        read: false,
      };
    }
  }
  const comms = await getCommunications();
  const newComm: Communication = {
    ...comm,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    read: false,
  };
  comms.unshift(newComm);
  writeJSON("communications.json", comms);
  return newComm;
}

export async function markCommunicationRead(id: string): Promise<boolean> {
  if (await isSupabaseReady()) {
    const { error, count } = await getSupabaseAdmin()
      .from("communications")
      .update({ read: true })
      .eq("id", id);
    if (error) throw error;
    return Boolean(count);
  }
  const comms = await getCommunications();
  const comm = comms.find((c) => c.id === id);
  if (!comm) return false;
  comm.read = true;
  writeJSON("communications.json", comms);
  return true;
}

// ─── Subscribers ───

export async function getSubscribers(): Promise<Subscriber[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("communications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || [])
      .filter(
        (row: any) =>
          row.metadata?.subscribeNewsletters ||
          row.metadata?.subscribeArticles ||
          row.metadata?.subscribeBlogs
      )
      .map((row: any) => ({
        id: String(row.id),
        name: row.name || "",
        email: row.email || "",
        phone: row.phone || "",
        city: row.city || "",
        subscribeNewsletters: row.metadata?.subscribeNewsletters || false,
        subscribeArticles: row.metadata?.subscribeArticles || false,
        subscribeBlogs: row.metadata?.subscribeBlogs || false,
        createdAt: row.created_at,
      }));
  }
  return readJSON<Subscriber[]>("subscribers.json", []);
}

export async function addSubscriber(
  sub: Omit<Subscriber, "id" | "createdAt">
): Promise<Subscriber> {
  if (await isSupabaseReady()) {
    try {
      const { data: existing } = await getSupabaseAdmin()
        .from("communications")
        .select("id")
        .eq("email", sub.email)
        .limit(1)
        .maybeSingle();
      if (existing) {
        await getSupabaseAdmin()
          .from("communications")
          .update({
            metadata: {
              subscribeNewsletters: sub.subscribeNewsletters,
              subscribeArticles: sub.subscribeArticles,
              subscribeBlogs: sub.subscribeBlogs,
            },
          })
          .eq("id", existing.id);
        return { ...sub, id: String(existing.id), createdAt: new Date().toISOString() };
      }
      const { data, error } = await getSupabaseAdmin()
        .from("communications")
        .insert({
          name: sub.name,
          email: sub.email,
          phone: sub.phone,
          city: sub.city,
          message: "Newsletter subscriber",
          read: false,
          metadata: {
            subscribeNewsletters: sub.subscribeNewsletters,
            subscribeArticles: sub.subscribeArticles,
            subscribeBlogs: sub.subscribeBlogs,
          },
        })
        .select()
        .single();
      if (error) throw error;
      return { ...sub, id: String(data.id), createdAt: data.created_at };
    } catch (e: any) {
      if (isSchemaCacheError(e) || isTableMissingError(e)) {
        console.warn("[DB] Subscriber insert failed (schema cache), falling back to local JSON");
        _supabaseReady = null;
      } else {
        throw e;
      }
    }
  }
  const subs = readJSON<Subscriber[]>("subscribers.json", []);
  const existing = subs.find(
    (s) => s.email.toLowerCase() === sub.email.toLowerCase()
  );
  if (existing) {
    Object.assign(existing, sub);
    writeJSON("subscribers.json", subs);
    return existing;
  }
  const newSub: Subscriber = {
    ...sub,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
  };
  subs.push(newSub);
  writeJSON("subscribers.json", subs);
  return newSub;
}

// ─── Replies ───

export async function getReplies(): Promise<ReplyRecord[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("replies")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: String(row.id),
      toEmail: row.metadata?.toEmail || "",
      toName: row.metadata?.toName || "",
      subject: row.metadata?.subject || "",
      message: row.metadata?.message || "",
      createdAt: row.created_at,
    }));
  }
  return readJSON<ReplyRecord[]>("replies.json", []);
}

export async function addReply(
  reply: Omit<ReplyRecord, "id" | "createdAt">
): Promise<ReplyRecord> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("replies")
      .insert({
        metadata: {
          toEmail: reply.toEmail,
          toName: reply.toName,
          subject: reply.subject,
          message: reply.message,
        },
      })
      .select()
      .single();
    if (error) throw error;
    return { ...reply, id: String(data.id), createdAt: data.created_at };
  }
  const replies = readJSON<ReplyRecord[]>("replies.json", []);
  const newReply: ReplyRecord = {
    ...reply,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
  };
  replies.unshift(newReply);
  writeJSON("replies.json", replies);
  return newReply;
}

// ─── Demo Requests ───

export async function getDemoRequests(): Promise<DemoRequest[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("communications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data || [])
      .filter((row: any) => row.interest?.startsWith("Demo request:"))
      .map((row: any) => ({
        id: String(row.id),
        name: row.name || "",
        email: row.email || "",
        company: row.company || "",
        phone: row.phone || "",
        interest: row.interest?.replace("Demo request: ", "") || "",
        message: row.message || "",
        createdAt: row.created_at,
      }));
  }
  return readJSON<DemoRequest[]>("demos.json", []);
}

export async function addDemoRequest(
  req: Omit<DemoRequest, "id" | "createdAt">
): Promise<DemoRequest> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("communications")
      .insert({
        name: req.name,
        email: req.email,
        phone: req.phone,
        company: req.company,
        city: "",
        interest: req.interest
          ? `Demo request: ${req.interest}`
          : "Demo request",
        message: req.message,
        read: false,
        metadata: { type: "demo" },
      })
      .select()
      .single();
    if (error) {
      if (isSchemaCacheError(error) || isTableMissingError(error)) {
        console.warn("[DB] Supabase demo insert failed (schema cache), falling back to local JSON");
        _supabaseReady = null;
      } else {
        throw error;
      }
    } else {
      return { ...req, id: String(data.id), createdAt: data.created_at };
    }
  }
  const reqs = readJSON<DemoRequest[]>("demos.json", []);
  const newReq: DemoRequest = {
    ...req,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
  };
  reqs.unshift(newReq);
  writeJSON("demos.json", reqs);
  return newReq;
}

// ─── SMTP Config ───

export function getSmtpConfig(): SmtpConfig | null {
  return readJSON<SmtpConfig | null>("smtp.json", null);
}

export function saveSmtpConfig(config: SmtpConfig): void {
  writeJSON("smtp.json", config);
}

// ─── Admin ───

export async function getAdmin(): Promise<AdminUser | null> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("admins")
      .select("id,email,name,password_hash,created_at")
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: String(data.id),
      name: data.name || "",
      email: data.email,
      password: data.password_hash || "",
      authMethod: "manual",
      createdAt: data.created_at,
    };
  }
  const admins = readJSON<AdminUser[]>("admins.json", []);
  return admins.length > 0 ? admins[0] : null;
}

export async function getAdminByEmail(email: string): Promise<AdminUser | null> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("admins")
      .select("id,email,name,password_hash,created_at")
      .eq("email", email)
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: String(data.id),
      name: data.name || "",
      email: data.email,
      password: data.password_hash || "",
      authMethod: "manual",
      createdAt: data.created_at,
    };
  }
  const admins = readJSON<AdminUser[]>("admins.json", []);
  return (
    admins.find(
      (admin) => admin.email.toLowerCase() === email.toLowerCase()
    ) || null
  );
}

export async function getAdmins(): Promise<AdminUser[]> {
  if (await isSupabaseReady()) {
    const { data, error } = await getSupabaseAdmin()
      .from("admins")
      .select("id,email,name,created_at");
    if (error) throw error;
    return (data || []).map((row: any) => ({
      id: String(row.id),
      name: row.name || "",
      email: row.email,
      password: "",
      authMethod: "manual" as const,
      createdAt: row.created_at,
    }));
  }
  return readJSON<AdminUser[]>("admins.json", []);
}

export function registerAdmin(
  admin: Omit<AdminUser, "id" | "createdAt">
): AdminUser {
  const admins = readJSON<AdminUser[]>("admins.json", []);
  const newAdmin: AdminUser = {
    ...admin,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
  };
  admins.push(newAdmin);
  writeJSON("admins.json", admins);
  return newAdmin;
}

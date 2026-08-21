import fs from "fs";
import path from "path";
import { getSupabaseAdmin } from "./supabase";

const DATA_DIR = path.join(process.cwd(), "data");

function useSupabase() {
  return Boolean(
    (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
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

// ─── Default data ───

const DEFAULT_TEAMS: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Anandhi",
    role: "Founder & Research Director",
    bio: "Leading applied AI research with a focus on bridging academic innovation and real-world systems.",
    image: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Dr. Anasuya Devi",
    role: "Head of AI & Machine Learning",
    bio: "Specializing in machine learning architectures and generative AI systems for complex engineering challenges.",
    image: "",
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

// ─── CRUD Operations ───

// Teams
export async function getTeams(): Promise<TeamMember[]> {
  if (useSupabase()) {
    const { data, error } = await getSupabaseAdmin().from("teams").select("*").order("created_at", { ascending: true });
    if (error) throw error;
    return (data || []).map((row: any) => ({ id: String(row.id), name: row.name, role: row.metadata?.role || "", bio: row.metadata?.bio || row.description || "", image: row.metadata?.image || "", createdAt: row.created_at }));
  }
  return readJSON<TeamMember[]>("teams.json", DEFAULT_TEAMS);
}

export function saveTeams(teams: TeamMember[]) {
  writeJSON("teams.json", teams);
}

export async function addTeam(member: Omit<TeamMember, "id" | "createdAt">): Promise<TeamMember> {
  if (useSupabase()) {
    const { data, error } = await getSupabaseAdmin().from("teams").insert({ name: member.name, slug: `${member.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`, description: member.bio, metadata: member }).select().single();
    if (error) throw error;
    return { ...member, id: String(data.id), createdAt: data.created_at };
  }
  const teams = getTeams();
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
  if (useSupabase()) {
    const { error, count } = await getSupabaseAdmin().from("teams").delete({ count: "exact" }).eq("id", id);
    if (error) throw error;
    return Boolean(count);
  }
  const teams = getTeams();
  const filtered = teams.filter((t) => t.id !== id);
  if (filtered.length === teams.length) return false;
  saveTeams(filtered);
  return true;
}

// Products
export async function getProducts(): Promise<Product[]> {
  if (useSupabase()) {
    const { data, error } = await getSupabaseAdmin().from("products").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) => ({ ...row.metadata, id: String(row.id), name: row.name, slug: row.slug, description: row.description || "", image: row.metadata?.image || "", tags: row.metadata?.tags || [], createdAt: row.created_at }));
  }
  return readJSON<Product[]>("products.json", DEFAULT_PRODUCTS);
}

export function saveProducts(products: Product[]) {
  writeJSON("products.json", products);
}

export async function addProduct(product: Omit<Product, "id" | "createdAt">): Promise<Product> {
  if (useSupabase()) {
    const { data, error } = await getSupabaseAdmin().from("products").insert({ name: product.name, slug: product.slug, description: product.description, metadata: product }).select().single();
    if (error) throw error;
    return { ...product, id: String(data.id), createdAt: data.created_at };
  }
  const products = getProducts();
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
  if (useSupabase()) {
    const { error, count } = await getSupabaseAdmin().from("products").delete({ count: "exact" }).eq("id", id);
    if (error) throw error;
    return Boolean(count);
  }
  const products = getProducts();
  const filtered = products.filter((p) => p.id !== id);
  if (filtered.length === products.length) return false;
  saveProducts(filtered);
  return true;
}

// Blogs
export async function getBlogs(): Promise<Blog[]> {
  if (useSupabase()) {
    const { data, error } = await getSupabaseAdmin().from("blogs").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map((row: any) => ({ ...row.metadata, id: String(row.id), title: row.title, excerpt: row.excerpt || "", content: typeof row.content === "string" ? row.content : row.metadata?.content || "", coverImage: row.cover_image_url || "", createdAt: row.created_at, updatedAt: row.updated_at || row.created_at, readTime: row.metadata?.readTime || 1, type: row.metadata?.type || "blog", author: row.metadata?.author || "ASRT Team", pdfUrl: row.metadata?.pdfUrl || "" }));
  }
  return readJSON<Blog[]>("blogs.json", []);
}

export function saveBlogs(blogs: Blog[]) {
  writeJSON("blogs.json", blogs);
}

export async function addBlog(blog: Omit<Blog, "id" | "createdAt" | "updatedAt" | "readTime">): Promise<Blog> {
  if (useSupabase()) {
    const readTime = Math.max(1, Math.ceil(blog.content.replace(/<[^>]*>/g, "").split(/\s+/).length / 200));
    const { data, error } = await getSupabaseAdmin().from("blogs").insert({ title: blog.title, slug: `${blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`, excerpt: blog.excerpt, content: JSON.stringify(blog.content), cover_image_url: blog.coverImage, status: "published", metadata: { type: blog.type, author: blog.author, pdfUrl: blog.pdfUrl, readTime } }).select().single();
    if (error) throw error;
    return { ...blog, id: String(data.id), readTime, createdAt: data.created_at, updatedAt: data.updated_at || data.created_at };
  }
  const blogs = getBlogs();
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
  if (useSupabase()) {
    const { error, count } = await getSupabaseAdmin().from("blogs").delete({ count: "exact" }).eq("id", id);
    if (error) throw error;
    return Boolean(count);
  }
  const blogs = getBlogs();
  const filtered = blogs.filter((b) => b.id !== id);
  if (filtered.length === blogs.length) return false;
  saveBlogs(filtered);
  return true;
}

// Communications
export function getCommunications(): Communication[] {
  return readJSON<Communication[]>("communications.json", []);
}

export function saveCommunications(comms: Communication[]) {
  writeJSON("communications.json", comms);
}

export function addCommunication(
  comm: Omit<Communication, "id" | "createdAt" | "read">
): Communication {
  const comms = getCommunications();
  const newComm: Communication = {
    ...comm,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    read: false,
  };
  comms.unshift(newComm);
  saveCommunications(comms);
  return newComm;
}

export function markCommunicationRead(id: string): boolean {
  const comms = getCommunications();
  const comm = comms.find((c) => c.id === id);
  if (!comm) return false;
  comm.read = true;
  saveCommunications(comms);
  return true;
}

// Sent Replies
export interface ReplyRecord {
  id: string;
  toEmail: string;
  toName: string;
  subject: string;
  message: string;
  createdAt: string;
}

export function getReplies(): ReplyRecord[] {
  return readJSON<ReplyRecord[]>("replies.json", []);
}

export function addReply(reply: Omit<ReplyRecord, "id" | "createdAt">): ReplyRecord {
  const replies = getReplies();
  const newReply: ReplyRecord = {
    ...reply,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
  };
  replies.unshift(newReply);
  writeJSON("replies.json", replies);
  return newReply;
}

// Subscribers
export function getSubscribers(): Subscriber[] {
  return readJSON<Subscriber[]>("subscribers.json", []);
}

export function addSubscriber(sub: Omit<Subscriber, "id" | "createdAt">): Subscriber {
  const subs = getSubscribers();
  const existing = subs.find((s) => s.email.toLowerCase() === sub.email.toLowerCase());
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

// Demo Requests
export function getDemoRequests(): DemoRequest[] {
  return readJSON<DemoRequest[]>("demos.json", []);
}

export function addDemoRequest(req: Omit<DemoRequest, "id" | "createdAt">): DemoRequest {
  const reqs = getDemoRequests();
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

export interface SmtpConfig {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
}

export function getSmtpConfig(): SmtpConfig | null {
  const config = readJSON<SmtpConfig | null>("smtp.json", null);
  return config;
}

export function saveSmtpConfig(config: SmtpConfig): void {
  writeJSON("smtp.json", config);
}

// ─── Admin ───

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password: string;
  authMethod: "google" | "manual";
  createdAt: string;
}

export function getAdmin(): AdminUser | null {
  const admins = readJSON<AdminUser[]>("admins.json", []);
  return admins.length > 0 ? admins[0] : null;
}

export function getAdminByEmail(email: string): AdminUser | null {
  const admins = readJSON<AdminUser[]>("admins.json", []);
  return admins.find((admin) => admin.email.toLowerCase() === email.toLowerCase()) || null;
}

export function getAdmins(): AdminUser[] {
  return readJSON<AdminUser[]>("admins.json", []);
}

export function registerAdmin(
  admin: Omit<AdminUser, "id" | "createdAt">
): AdminUser {
  const admins = getAdmins();
  const newAdmin: AdminUser = {
    ...admin,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
  };
  admins.push(newAdmin);
  writeJSON("admins.json", admins);
  return newAdmin;
}

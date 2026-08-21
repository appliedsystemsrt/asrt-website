import { NextRequest, NextResponse } from "next/server";
import { getBlogs, addBlog, deleteBlog } from "@/lib/db";
import { notifySubscribers } from "@/lib/email";

export async function GET() {
  return NextResponse.json(getBlogs());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const blog = addBlog(body);
  const notifications = await notifySubscribers(blog);
  return NextResponse.json({ ...blog, notifications }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const success = deleteBlog(id);
  if (!success) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

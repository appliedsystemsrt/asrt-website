import { NextRequest, NextResponse } from "next/server";
import { addSubscriber, getCommunications, addCommunication, markCommunicationRead } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getCommunications());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const comm = addCommunication(body);
  if (body.subscribeNewsletters || body.subscribeArticles || body.subscribeBlogs) {
    addSubscriber({
      name: body.name || "",
      email: body.email,
      phone: body.phone || "",
      city: body.city || "",
      subscribeNewsletters: Boolean(body.subscribeNewsletters),
      subscribeArticles: Boolean(body.subscribeArticles),
      subscribeBlogs: Boolean(body.subscribeBlogs),
    });
  }
  return NextResponse.json(comm, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  if (body.action === "markRead" && body.id) {
    const success = markCommunicationRead(body.id);
    return NextResponse.json({ success });
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

import { NextRequest, NextResponse } from "next/server";
import { getCommunications, addCommunication, markCommunicationRead, addSubscriber } from "@/lib/db";

export async function GET() {
  const comms = await getCommunications();
  return NextResponse.json(comms);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const comm = await addCommunication(body);
  if (body.subscribeNewsletters || body.subscribeArticles || body.subscribeBlogs) {
    await addSubscriber({
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
    const success = await markCommunicationRead(body.id);
    return NextResponse.json({ success });
  }
  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

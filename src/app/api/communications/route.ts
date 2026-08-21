import { NextRequest, NextResponse } from "next/server";
import { getCommunications, addCommunication, markCommunicationRead, addSubscriber } from "@/lib/db";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";

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

  // Toggle subscription preferences
  if (body.id && (body.subscribeNewsletters !== undefined || body.subscribeArticles !== undefined || body.subscribeBlogs !== undefined)) {
    if (isSupabaseConfigured()) {
      const { error } = await getSupabaseAdmin()
        .from("communications")
        .update({
          metadata: {
            subscribeNewsletters: body.subscribeNewsletters ?? false,
            subscribeArticles: body.subscribeArticles ?? false,
            subscribeBlogs: body.subscribeBlogs ?? false,
          },
        })
        .eq("id", body.id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Subscription toggle requires Supabase" }, { status: 500 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

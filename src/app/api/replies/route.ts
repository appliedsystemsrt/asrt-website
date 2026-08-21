import { NextRequest, NextResponse } from "next/server";
import { getReplies } from "@/lib/db";

export async function GET(req: NextRequest) {
  if (!req.cookies.get("admin-token")?.value) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(getReplies());
}
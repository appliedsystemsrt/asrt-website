import { NextRequest, NextResponse } from "next/server";
import { getTeams, addTeam, deleteTeam } from "@/lib/db";

export async function GET() {
  const teams = await getTeams();
  return NextResponse.json(teams);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const member = await addTeam(body);
  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const success = await deleteTeam(id);
  if (!success) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}

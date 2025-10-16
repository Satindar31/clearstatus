import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";

export async function GET(req: Request) {
  const greeting = await get("greeting");
  return NextResponse.json(greeting);
}

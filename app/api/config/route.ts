import { NextResponse } from "next/server";
import { get } from "@vercel/edge-config";
import Get from "@/lib/edgeClient";

export async function GET(req: Request) {
  const greeting = await Get("greeting");
  return NextResponse.json(greeting);
}

import prisma from "@/prisma/prisma";
import type { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  const now = new Date();

  const url = _req.url;
  const slug = new URL(url).searchParams.get("slug");

  if (!slug) {
    return new Response(JSON.stringify({ error: "Missing slug" }), {
      status: 400,
    });
  }

  const components = await prisma.monitor.findMany({
    where: {
      statusPage: {
        slug,
      },
    },
  });

  if (components.length === 0) {
    return new Response(JSON.stringify({ error: "Status page not found" }), {
      status: 404,
    });
  }
  /* 
    const components = [
    { id: "api", name: "Public API", status: "operational", uptime30d: 99.98, responseMs: 142 },
    { id: "gateway", name: "Gateway", status: "operational", uptime30d: 99.92, responseMs: 88 },
    { id: "realtime", name: "Realtime Service", status: "degraded", uptime30d: 99.2, responseMs: 260 },
    { id: "db", name: "Primary Database", status: "operational", uptime30d: 99.99, responseMs: 12 },
    { id: "cdn", name: "CDN", status: "operational", uptime30d: 99.97, responseMs: 34 },
    { id: "auth", name: "Auth", status: "operational", uptime30d: 99.95, responseMs: 65 },
  ] as const
   */

  const inc = await prisma.incident.findMany({
    where: {
      statusPage: {
        slug
      }
    },
  });


  // Generate 30 days of uptime around 99.5-100
  const dailyUptime = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date(now);
    date.setDate(now.getDate() - (29 - i));
    const base = 99.6 + Math.random() * 0.4;
    return { date: date.toISOString(), uptime: Math.min(100, base) };
  });

  // Overall status is the worst component status
  const rank: Record<string, number> = {
    operational: 0,
    maintenance: 1,
    degraded: 2,
    partial_outage: 3,
    major_outage: 4,
  };
  const overall = (components as any[]).reduce(
    (acc, c) => (rank[c.status] > rank[acc] ? c.status : acc),
    "operational"
  );

  return Response.json({
    status: overall,
    updatedAt: now.toISOString(),
    components,
    inc,
    dailyUptime,
  });
}

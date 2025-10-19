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

  const inc = await prisma.incident.findMany({
    where: {
      statusPage: {
        slug
      }
    },
    include: {
      Updates: {
        orderBy: { createdAt: "desc" }
      }
    },
    
    orderBy: {
      createdAt: "desc"
    }
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
    ALL_OPERATIONAL: 0,
    MAINTAINENCE: 1,
    DEGRADED: 2,
    PARTIAL_OUTAGE: 3,
    MAJOR_OUTAGE: 4,
  };
  const overall = (components as any[]).reduce(
    (acc, c) => (rank[c.status] > rank[acc] ? c.status : acc),
    "ALL_OPERATIONAL"
  );

  return Response.json({
    status: overall,
    updatedAt: now.toISOString(),
    components,
    inc,
    dailyUptime,
  });
}

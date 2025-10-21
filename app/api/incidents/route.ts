import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import { IncidentSeverity, IncidentStatus, MonitorStatus } from "@/generated/prisma/enums";
export async function POST(request: Request) {
  const {
    title,
    statusPageId,
    description,
    status,
    severity,
  }: {
    title: string;
    statusPageId: string;
    description: string;
    status: string;
    severity: string;
  } = await request.json();

  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });
  const user_id = session?.user.id;

  if (!user_id) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const newIncident = await prisma.incident.create({
      data: {
        id: crypto.randomUUID(),
        title,
        status: status.toUpperCase() as IncidentStatus,
        description,
        severity: severity.toUpperCase() as IncidentSeverity,
        statusPage: {
          connect: {
            id: statusPageId,
          },
        },
        Updates: {
          create: {
            id: crypto.randomUUID(),
            message: description,
            status: status.toUpperCase() as IncidentStatus,
            updateBy: {
              connect: {
                id: user_id,
              }
            }
          }
        },
        reportedBy: {
          connect: {
            id: user_id,
          },
        },
      },
      include: {
        monitors: true,
      }
    });

    // TODO manually created incidents are not yet linked to monitors

    // await prisma.monitor.update({
    //   where: {
    //     id: newIncident.monitors[0].id
    //   },
    //   data: {
    //     status: severity.toUpperCase() === "MAJOR" || severity.toUpperCase() === "CRITICAL" ? "DOWN" : "DEGRADED" as MonitorStatus
    //   }
    // })

    return NextResponse.json(newIncident, { status: 201 });
  } catch (error) {
    console.error("Error creating incident:", error);
    return new Response("Failed to create incident", { status: 500 });
  }
}


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusPageId = searchParams.get("statusPageId");
  if (!statusPageId) {
    return new Response("status_page_id is required", { status: 400 });
  }

  try {
    const incidents = await prisma.incident.findMany({
      where: {
        statusPage: {
          id: statusPageId
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(incidents, { status: 200 });
  } catch (error) {
    console.error("Error fetching incidents:", error);
    return new Response("Failed to fetch incidents", { status: 500 });
  }
}
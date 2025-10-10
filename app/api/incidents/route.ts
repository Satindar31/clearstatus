import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
export async function POST(request: Request) {
  const {
    title,
    status_page_id,
    description,
    status,
    severity,
  }: {
    title: string;
    status_page_id: string;
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
        status: status.toUpperCase() as
          | "INVESTIGATING"
          | "IDENTIFIED"
          | "MONITORING"
          | "RESOLVED",
        severity: severity.toUpperCase() as "MINOR" | "MAJOR" | "CRITICAL",
        statusPage: {
          connect: {
            id: status_page_id,
          },
        },
        reportedBy: {
          connect: {
            id: user_id,
          },
        },
      },
    });

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
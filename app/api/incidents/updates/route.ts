import { IncidentSeverity, IncidentStatus } from "@/generated/prisma/enums";
import { auth } from "@/lib/auth";
import prisma from "@/prisma/prisma";
import { headers } from "next/headers";

export async function PUT(request: Request) {
  const {
    title,
    description,
    severity,
    status,
    slug,
  }: {
    title: string;
    description: string;
    severity: IncidentSeverity | null;
    status: IncidentStatus;
    slug: string;
  } = await request.json();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  try {
    if (severity !== null) {
      const update = await prisma.updates.create({
        data: {
          id: crypto.randomUUID(),
          message: description,
          status: status,
          incident: {
            connect: {
              id: slug,
            },
          },
          informSubscribers: true,
          updateBy: {
            connect: {
              id: session?.user.id,
            },
          },
        },
      });
      await prisma.incident.update({
        where: {
          id: update.incidentId,
        },
        data: {
          severity,
        },
      });
      return new Response(JSON.stringify(update), {
        status: 201,
      });
    }
    const update = await prisma.updates.create({
      data: {
        id: crypto.randomUUID(),
        message: description,
        status: status,
        incident: {
          connect: {
            id: slug,
          },
        },
        informSubscribers: true,
        updateBy: {
          connect: {
            id: session?.user.id,
          },
        },
      },
    });
    return new Response(JSON.stringify(update), {
      status: 201,
    });
  } catch (e) {
    console.log(e);
    return new Response(JSON.stringify(e), {
      status: 418,
    });
  }
}

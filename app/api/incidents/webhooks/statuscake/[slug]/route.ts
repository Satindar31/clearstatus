import { makeId } from "@/app/api/monitors/create/route";
import { IncidentStatus, MonitorStatus } from "@/generated/prisma/enums";
import prisma from "@/prisma/prisma";

export async function POST(request: Request) {
  const body = await request.text();
  // Parse URL-encoded form data
  const params = new URLSearchParams(body);
  const token = params.get("Token");
  const status = params.get("Status");
  const testId = params.get("TestID");
  const statusCode = params.get("StatusCode");
  // Generate a unique incident id for each event
  // Use TestID, Status, StatusCode, and timestamp for uniqueness
  const eventId = `${testId || ""}_${status || ""}_${
    statusCode || ""
  }_${Date.now()}`;
  // Extract slug from request URL (last string after last '/')
  const slug = request.url.split("/").pop();
  let _status;

  console.log(body); // For debugging
  if (status?.toLocaleLowerCase() == "down") {
    _status = IncidentStatus.OPEN;
  } else if (status?.toLocaleLowerCase() == "up") {
    _status = IncidentStatus.RESOLVED;
  } else {
    return new Response("Event not handled", { status: 200 });
  }

  console.log("Received webhook for slug:", slug, "with status:", status);
  if (!slug) {
    return new Response("Missing slug", { status: 400 });
  }
  const monitor = await prisma.monitor.findFirst({
    where: {
      Webhook: {
        some: {
          slug,
        },
      },
    },
  });
  if (!monitor) {
    return new Response("Monitor not found", { status: 404 });
  }
  const incident = await prisma.incident.findFirst({
    where: {
      monitors: {
        some: { id: monitor.id },
      },
      resolvedAt: null,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  if (incident) {
    if (_status == IncidentStatus.RESOLVED) {
      await prisma.incident.update({
        where: { id: incident.id },
        data: {
          status: IncidentStatus.RESOLVED,
          resolvedAt: new Date(),
          monitors: {
            update: {
              where: { id: monitor.id },
              data: { status: MonitorStatus.UP },
            },
          },
          Updates: {
            create: {
              id: crypto.randomUUID(),
              message: `Monitor ${monitor.name} is back up (StatusCode: ${statusCode})`,
              status: IncidentStatus.RESOLVED,
              updateBy: {
                connect: {
                  id: process.env.STATUSCAKE_USER_ID || "",
                },
              },
            },
          },
        },
      });
    }
    if (_status == IncidentStatus.OPEN) {
      await prisma.incident.update({
        where: {
          id: incident.id,
        },
        data: {
          status: IncidentStatus.OPEN,
          monitors: {
            update: {
              where: { id: monitor.id },
              data: { status: MonitorStatus.DOWN },
            },
          },
          Updates: {
            create: {
              id: crypto.randomUUID(),
              message: `Monitor ${monitor.name} is down (StatusCode: ${statusCode})`,
              status: IncidentStatus.OPEN,
              updateBy: {
                connect: {
                  id: process.env.STATUSCAKE_USER_ID || "",
                },
              },
            },
          },
        },
      });
    }
  } else {
    await prisma.incident.create({
      data: {
        monitors: {
          connect: { id: monitor.id },
        },
        status: _status || IncidentStatus.OPEN,
        title: `Incident for monitor ${monitor.name}`,
        description: "",
        reportedBy: {
          connect: {
            id: process.env.STATUSCAKE_USER_ID || "",
          },
        },
        id: eventId,
        statusPage: {
          connect: { id: monitor.statusPageId },
        },
        Updates: {
          create: {
            id: crypto.randomUUID(),
            message:
              _status == IncidentStatus.OPEN
                ? `Monitor ${monitor.name} is down (StatusCode: ${statusCode})`
                : `Monitor ${monitor.name} is back up (StatusCode: ${statusCode})`,
            status: _status || IncidentStatus.OPEN,
            updateBy: {
              connect: {
                id: process.env.STATUSCAKE_USER_ID || "",
              },
            },
          },
        },
      },
    });
    await prisma.monitor.update({
      where: { id: monitor.id },
      data: {
        status:
          _status == IncidentStatus.OPEN
            ? MonitorStatus.DOWN
            : MonitorStatus.UP,
      },
    });
  }
  return new Response("Incident processed", { status: 200 });
}

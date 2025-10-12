import { makeId } from "@/app/api/monitors/create/route";
import { IncidentStatus, MonitorStatus } from "@/generated/prisma/enums";
import prisma from "@/prisma/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  // Extract slug from request URL (last string after last '/')
  const slug = request.url.split("/").pop();
  let _status;
  if (body[0].event == "check.down") {
    _status = IncidentStatus.OPEN;
  } else if (body[0].event == "check.up") {
    _status = IncidentStatus.RESOLVED;
  } else {
    return new Response("Event not handled", { status: 200 });
  }

  console.log(
    "Received webhook for slug:",
    slug,
    "with status:",
    body[0].event
  );
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
        title: body.incident_title || `Incident for monitor ${monitor.name}`,
        description: body.incident_description || "",
        reportedBy: {
          connect: {
            id: process.env.UPDOWN_USER_ID || "",
          },
        },
        id: body[0].downtime.id || makeId(8),
        statusPage: {
          connect: { id: monitor.statusPageId },
        },
      },
    });
  }
  return new Response("Incident processed", { status: 200 });
}

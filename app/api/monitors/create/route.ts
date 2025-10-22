import prisma from "@/prisma/prisma";
import { MonitorStatus, UptimeChecker } from "@/generated/prisma/enums";
import { makeId } from "@/hooks/id";

export async function POST(request: Request) {
  const {
    statusPageId,
    name,
    url,
    description,
    monitorType,
    status,
    isVisible,
  }: {
    statusPageId: string;
    name: string;
    url: string;
    description: string;
    monitorType: string;
    status: string;
    isVisible: boolean;
  } = await request.json();

  try {
    let _status;
    if (status === "operational") {
      _status = MonitorStatus.UP;
    } else if (status === "degraded") {
      _status = MonitorStatus.DOWN;
    } else if (status === "down") {
      _status = MonitorStatus.DOWN;
    } else if (status === "maintenance") {
      _status = MonitorStatus.PAUSED;
    }

    const monitor = await prisma.monitor.create({
      data: {
        id: makeId(8),
        name,
        type: "HTTP",
        url,
        status: _status,
        description: description || undefined,
        statusPage: {
          connect: {
            id: statusPageId,
          },
        },
        uptimeChecker: monitorType.toUpperCase() as UptimeChecker,
        isVisible: isVisible,
      },
    });
    return new Response(JSON.stringify(monitor), { status: 201 });
  } catch (error) {
    console.error("Error creating monitor:", error);
    return new Response("Failed to create monitor", { status: 500 });
  }
}



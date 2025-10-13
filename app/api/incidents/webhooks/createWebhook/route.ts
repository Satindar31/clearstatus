import { UptimeChecker } from "@/generated/prisma/enums";
import prisma from "@/prisma/prisma";

export async function POST(request: Request) {
  const {
    checker,
    monitorId,
    statusPageId,
  }: { checker: string; monitorId: string; statusPageId: string } =
    await request.json();



  try {
    const webhook = await prisma.webhook.create({
      data: {
        uptimeChecker: checker.toUpperCase() as UptimeChecker,
        slug: monitorId,
        monitor: {
          connect: {
            id: monitorId,
          },
        },
        statusPage: {
          connect: {
            id: statusPageId,
          },
        },
      },
    });

    return new Response(JSON.stringify(webhook), { status: 201 });
  } catch (error) {
    console.error("Error creating webhook:", error);
    return new Response("Failed to create webhook", { status: 500 });
  }
}

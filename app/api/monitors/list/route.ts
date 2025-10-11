import prisma from "@/prisma/prisma";

export async function GET(request: Request) {
  const statusPageId = new URL(request.url).searchParams.get("statusPageId");
  if (!statusPageId) {
    return new Response("Missing statusPageId", { status: 400 });
  }

  const monitors = await prisma.monitor.findMany({
    where: {
      statusPageId,
    },
    include: {
      Webhook: true,
    }
  });
  return new Response(JSON.stringify(monitors), { status: 200 });
}

import prisma from "@/prisma/prisma";

export async function POST(request: Request) {
    const { incidentId } = await request.json();

    try {
        const updatedIncident = await prisma.incident.update({
            where: { id: incidentId },
            data: { status: 'RESOLVED' },
        });
        return new Response(JSON.stringify(updatedIncident), { status: 200 });
    } catch (error) {
        console.error(`Error resolving incident ${incidentId}:`, error);
        return new Response('Failed to resolve incident', { status: 500 });
    }
}
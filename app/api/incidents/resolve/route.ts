import { makeId } from "@/hooks/id";
import { auth } from "@/lib/auth";
import prisma from "@/prisma/prisma";
import { headers } from "next/headers";

export async function POST(request: Request) {
	const { incidentId } = await request.json();
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user) {
		return new Response("Unauthorized", { status: 401 });
	}
	try {
		const updatedIncident = await prisma.incident.update({
			where: { id: incidentId },
			data: {
				status: "RESOLVED",
				Updates: {
					create: {
						id: makeId(8),
						title: "Incident Resolved",
						status: "RESOLVED",
						message: "Incident has been resolved.",
						updateById: session?.user.id || null,
					},
				},
			},
		});
		return new Response(JSON.stringify(updatedIncident), { status: 200 });
	} catch (error) {
		console.error(`Error resolving incident ${incidentId}:`, error);
		return new Response("Failed to resolve incident", { status: 500 });
	}
}

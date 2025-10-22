import prisma from "@/prisma/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";
import {
	IncidentSeverity,
	IncidentStatus,
	MonitorStatus,
} from "@/generated/prisma/enums";
import { makeId } from "@/hooks/id";
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
				id: makeId(8),
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
						id: makeId(8),
						title: description,
						message: "",
						status: status.toUpperCase() as IncidentStatus,
						updateBy: {
							connect: {
								id: user_id,
							},
						},
					},
				},
				reportedBy: {
					connect: {
						id: user_id,
					},
				},
			},
			include: {
				monitors: true,
			},
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
	const incidentId = searchParams.get("incidentId");
	if (!statusPageId && !incidentId) {
		return new Response("status_page_id or incident_id is required", {
			status: 400,
		});
	}

	try {
		if (statusPageId) {
			const incidents = await prisma.incident.findMany({
				where: {
					statusPage: {
						id: statusPageId,
					},
				},
				orderBy: {
					createdAt: "desc",
				},
			});
			return NextResponse.json(incidents, { status: 200 });
		}
    else if (incidentId) {
      const incident = await prisma.incident.findUnique({
        where: {
          id: incidentId,
        },
      });
      return NextResponse.json(incident, { status: 200 });
    }
	} catch (error) {
		console.error("Error fetching incidents:", error);
		return new Response("Failed to fetch incidents", { status: 500 });
	}
}

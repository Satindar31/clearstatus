import { makeId } from "@/hooks/id";
import { IncidentStatus, MonitorStatus } from "@/generated/prisma/enums";
import prisma from "@/prisma/prisma";

export async function POST(request: Request) {
	const body = await request.json();
	// Extract slug from request URL (last string after last '/')
	const slug = request.url.split("/").pop();
	let _status;

	if (body.monitor_status == "offline") {
		_status = IncidentStatus.OPEN;
	} else if (body.monitor_status == "online") {
		_status = IncidentStatus.RESOLVED;
	}

	console.log(
		"Received webhook for slug:",
		slug,
		"with status:",
		body.monitor_status,
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
					monitors: {
						update: {
							where: { id: monitor.id },
							data: { status: MonitorStatus.UP },
						},
					},
					Updates: {
						create: {
							id: makeId(8),
							title: "Incident resolved: monitor is back online (automated)",
							status: IncidentStatus.RESOLVED,
							message: "",
							updateBy: {
								connect: {
									id: process.env.HETRIXTOOLS_USER_ID || "",
								},
							},
						},
					},
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
					monitors: {
						update: {
							where: { id: monitor.id },
							data: { status: MonitorStatus.DOWN },
						},
					},
					status: IncidentStatus.OPEN,
					Updates: {
						create: {
							id: makeId(8),
							title: "Incident updated: monitor is still down (automated)",
							message: "",
							status: IncidentStatus.OPEN,
							updateBy: {
								connect: {
									id: process.env.HETRIXTOOLS_USER_ID || "",
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
					connect: {
						id: monitor.id,
					},
				},
				status: _status || IncidentStatus.OPEN,
				title: `${monitor.name} is down (automated)`,

				description: body.incident_description || "",
				reportedBy: {
					connect: {
						id: process.env.HETRIXTOOLS_USER_ID || "",
					},
				},
				id: body.incident_id || makeId(8),
				statusPage: {
					connect: { id: monitor.statusPageId },
				},
				Updates: {
					create: {
						id: makeId(8),
						title: `${monitor.name} is down (automated)`,
            message: "",
						status: _status || IncidentStatus.OPEN,
						updateBy: {
							connect: {
								id: process.env.HETRIXTOOLS_USER_ID || "",
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

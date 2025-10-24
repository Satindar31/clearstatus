import { makeId } from "@/hooks/id";
import { IncidentStatus, MonitorStatus } from "@/generated/prisma/enums";
import prisma from "@/prisma/prisma";

export async function POST(request: Request) {
	const body = await request.json();
	// Extract slug from request URL (last string after last '/')
	const slug = request.url.split("/").pop();

	let _status;
	if (body.alert_type == "ALERT_FAILURE") {
		_status = IncidentStatus.OPEN;
	} else if (body.alert_type == "ALERT_RECOVERY") {
		_status = IncidentStatus.RESOLVED;
	} else {
		return new Response("Event not handled", { status: 200 });
	}

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
		if (_status == "RESOLVED") {
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
							id: makeId(8),
							title: `Monitor ${monitor.name} is back up (automated)`,
							message: "",
							status: IncidentStatus.RESOLVED,
							updateBy: {
								connect: {
									id: process.env.CHECKLY_USER_ID || "",
								},
							},
						},
					},
				},
			});
		}
		if (_status == "OPEN") {
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
							id: makeId(8),
							title: `Monitor ${monitor.name} is down (automated)`,
							message: "",
							status: IncidentStatus.OPEN,
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
				description: body.long_description || "",
				reportedBy: {
					connect: {
						id: process.env.CHECKLY_USER_ID || "",
					},
				},
				id: makeId(8),
				statusPage: {
					connect: { id: monitor.statusPageId },
				},
				Updates: {
					create: {
						id: makeId(8),
						title: `Monitor ${monitor.name} is down (automated)`,
						message: "",
						status: _status || IncidentStatus.OPEN,
						updateBy: {
							connect: {
								id: process.env.CHECKLY_USER_ID || "",
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

"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import { IncidentSeverity, IncidentStatus } from "@/generated/prisma/enums";
import { toast } from "sonner";
import { Updates } from "@/generated/prisma/client";
import { ScrollArea } from "../ui/scroll-area";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";

export function Form({ slug }: { slug: string }) {
	const router = useRouter();
	const [title, setTitle] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [status, setStatus] = React.useState<IncidentStatus>("INVESTIGATING");
	const [severity, setSeverity] = React.useState<IncidentSeverity | null>(null);

	React.useEffect(() => {
		fetch(`/api/incidents?incidentId=${slug}`, {
			cache: "force-cache",
			next: { revalidate: 60, tags: ["incident-details"] },
		}).then(async (res) => {
			if (!res.ok) {
				throw new Error("Failed to fetch incident details");
			}
			const data = (await res.json()) as {
				severity: IncidentSeverity | null;
				status: IncidentStatus;
			};
			setSeverity(data.severity);
			setStatus(data.status);
		});
	}, [slug]);

	function handleSubmit(e: FormEvent<HTMLFormElement>): void {
		e.preventDefault();

		const updateFetch = fetch(`/api/incidents/updates`, {
			method: "PUT",
			body: JSON.stringify({
				title,
				description,
				status,
				severity,
				slug,
			}),
		}).then(async (res) => {
			if (!res.ok) {
				throw new Error("Failed to update incident");
			}
			return res.json() as Promise<Updates>;
		});

		toast.promise(updateFetch, {
			loading: "Sending request...",
			success: (data) => {
				// router.push("/dashboard");
				return "Incident updated successfully!";
			},
			error: "Failed to create update. Please try again.",
		});
	}

	return (
		<form
			className="bg-slate-50 rounded-xl p-8 border-2 border-slate-200 h-fit"
			onSubmit={(e) => handleSubmit(e)}
		>
			<div>
				<label
					htmlFor="title"
					className="block text-sm font-medium text-slate-700 mb-1"
				>
					Update Title *
				</label>
				<input
					id="title"
					type="text"
					required
					className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
					placeholder="Elevated error rates observed"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			</div>

			<div>
				<label
					htmlFor="description"
					className="block text-sm font-medium text-slate-700 mb-1"
				>
					Description *
				</label>
				<textarea
					id="description"
					required
					rows={3}
					className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
					placeholder="We have identified an issue with our database cluster and are working on a fix."
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div>
					<label
						htmlFor="severity"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Incident Severity
					</label>
					<select
						id="severity"
						className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
						value={severity || undefined}
						onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
					>
						<option value="MINOR">Minor</option>
						<option value="MAJOR">Major</option>
						<option value="CRITICAL">Critical</option>
					</select>
				</div>

				<div>
					<label
						htmlFor="status"
						className="block text-sm font-medium text-slate-700 mb-1"
					>
						Status *
					</label>
					<select
						id="status"
						required
						className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
						value={status}
						onChange={(e) => setStatus(e.target.value as IncidentStatus)}
					>
						<option value="INVESTIGATING">Investigating</option>
						<option value="IDENTIFIED">Identified</option>
						<option value="MONITORING">Monitoring</option>
						<option value="RESOLVED">Resolved</option>
					</select>
				</div>
			</div>

			<div className="flex gap-3 pt-2">
				<button
					type="button"
					onClick={() => router.push("/dashboard")}
					className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
				>
					Update Incident
				</button>
			</div>
		</form>
	);
}

export function PreviousUpdates({ updates }: { updates: Updates[] }) {
	return (
		<ScrollArea className="h-full">
			<ul className="space-y-4">
				{updates.map((update) => (
					<li key={update.id} className="border-b pb-4">
						<p className="text-gray-700">{update.message}</p>
						<Tooltip>
							<TooltipTrigger>
								<p>
									{formatDistanceToNow(new Date(update.createdAt), {
										addSuffix: true,
									})}
								</p>
							</TooltipTrigger>
							<TooltipContent>
								<p>{new Date(update.createdAt).toLocaleString()}</p>
							</TooltipContent>
						</Tooltip>
					</li>
				))}
			</ul>
		</ScrollArea>
	);
}

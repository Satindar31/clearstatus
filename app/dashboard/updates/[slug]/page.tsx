import { Form, PreviousUpdates } from "@/components/dashboard/CreateUpdate";
import prisma from "@/prisma/prisma";
import { Suspense } from "react";

interface PageProps {
	params: {
		slug: string;
	};
}

export default async function UpdatesPage({ params }: PageProps) {
	"use server";
	const { slug } = await params;
	const updates = await prisma.updates.findMany({
		where: {
			incidentId: slug,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return (
		<div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<header className="mb-8 text-center">
					<h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
						Post a new update
					</h1>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-start">
					<div className="w-full">
						<div className="rounded-xl p-6 h-full">
							<Form slug={slug} />
						</div>
					</div>

					<div className="w-full">
						<div className="rounded-xl border-2 border-slate-200 p-6 flex flex-col">
							<h2 className="text-2xl font-semibold mb-4">Existing Updates</h2>
							<Suspense fallback={<div>Loading updates...</div>}>
								<PreviousUpdates updates={updates} />
							</Suspense>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

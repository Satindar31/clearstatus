import { Suspense } from "react"
import { StatusDashboard } from "@/components/status-dashboard"

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  return (
    <main className="min-h-dvh">
      <Suspense>
        <StatusDashboard slug={slug} />
      </Suspense>
    </main>
  );
}

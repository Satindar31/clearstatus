import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { SectionCards } from "@/components/section-cards";
import { isUserAdmin } from "@/hooks/admin/stats";
import { Suspense } from "react";
import { notFound } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  const admin = await isUserAdmin(session?.user?.email);

  if (!admin) {
    throw notFound()
  }
  return (
    <div className="min-h-screen bg-background">
      <div
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <Suspense fallback={<div>Loading...</div>}>
                <SectionCards />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

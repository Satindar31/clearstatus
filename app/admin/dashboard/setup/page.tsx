import InitialSetup from "@/components/admin/setup/initial";
import { isUserAdmin } from "@/hooks/admin/stats";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

export default async function SetupPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const admin = await isUserAdmin(session?.user?.email);

  if (!admin) {
    throw notFound();
  }
  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-3xl font-bold mb-4">Setup Dashboard</h1>
      <p className="text-muted-foreground">
        This is where the setup wizard will go.
      </p>
      <InitialSetup />
    </div>
  );
}

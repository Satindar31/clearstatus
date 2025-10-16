import InitialSetup from "@/components/admin/setup/initial";

export default function SetupPage() {
    return (
        <div className="container mx-auto p-4 h-screen">
            <h1 className="text-3xl font-bold mb-4">Setup Dashboard</h1>
            <p className="text-muted-foreground">This is where the setup wizard will go.</p>
            <InitialSetup />
        </div>
    );
    }
import MailSettings from "@/components/admin/setup/mailsettings";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 h-screen">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>
      <p className="text-muted-foreground">
        This is where the settings will go.
      </p>
      <div className="mt-4">
        <MailSettings />
        <p className="text-sm text-muted-foreground">
          No settings available yet.
        </p>
      </div>
    </div>
  );
}

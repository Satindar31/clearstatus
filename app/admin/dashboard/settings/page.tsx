import { MailSettings } from "@/components/admin/setup/mailsettings"

export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-2 text-lg text-muted-foreground">Configure your email providers and notification settings</p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-8">
          <MailSettings />
        </div>
      </div>
    </main>
  )
}

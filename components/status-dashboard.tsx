"use client"

import useSWR from "swr"
import { ThemeToggle } from "@/components/theme-toggle"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Summary } from "./summary"
import { ComponentsHealth } from "./components-health"
import { IncidentTimeline } from "./incident-timeline"
import { UptimeChart } from "./uptime-chart"
import { IncidentSeverity, IncidentStatus, MonitorStatus } from "@/generated/prisma/enums"
import { useEffect } from "react"
import { Incident } from "@/generated/prisma/client"

type ComponentStatus = "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance"

export type StatusAPI = {
  status: ComponentStatus
  updatedAt: string
  components: Array<{
    id: string
    name: string
    status: MonitorStatus
    uptime30d: number
    responseMs?: number
  }>
  inc: Incident[]
  dailyUptime: Array<{ date: string; uptime: number }>
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function StatusDashboard({ slug }: { slug: string }) {
  const { data, error, isLoading } = useSWR<StatusAPI>(`/api/status?slug=${slug}`, fetcher, {
    refreshInterval: 30_000,
  })

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 pb-6">
        <div className="flex items-center gap-3">
          <div aria-hidden className="h-8 w-8 rounded-md" style={{ backgroundColor: "var(--color-primary)" }} />
          <div>
            <h1 className="text-pretty text-xl font-semibold tracking-tight">System Status</h1>
            <p className="text-sm text-muted-foreground">Real-time reliability and incident history</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="hidden md:inline-flex">
            <a href="#history">Incident history</a>
          </Button>
          <ThemeToggle />
        </div>
      </header>

      {/* Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Summary
              loading={isLoading}
              error={!!error}
              overallStatus={data?.status}
              updatedAt={data?.updatedAt}
              avgResponseMs={Math.round(
                (data?.components?.reduce((a, c) => a + (c.responseMs ?? 0), 0) || 0) /
                  Math.max(1, data?.components?.filter((c) => c.responseMs != null).length || 1),
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Uptime (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <UptimeChart data={data?.dailyUptime || []} loading={isLoading} />
          </CardContent>
        </Card>
      </div>

      {/* Components */}
      <div className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Component Health</CardTitle>
          </CardHeader>
          <CardContent>
            <ComponentsHealth items={data?.components || []} loading={isLoading} />
          </CardContent>
        </Card>
      </div>

      {/* Incidents */}
      <div id="history" className="mt-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Incident Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <IncidentTimeline items={data?.inc || []} loading={isLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

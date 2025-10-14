import { cn } from "@/lib/utils"

type Props = {
  loading?: boolean
  error?: boolean
  overallStatus?: "operational" | "degraded" | "partial_outage" | "major_outage" | "maintenance"
  updatedAt?: string
  avgResponseMs?: number
}

function statusLabel(s?: Props["overallStatus"]) {
  switch (s) {
    case "operational":
      return "All systems operational"
    case "degraded":
      return "Degraded performance"
    case "partial_outage":
      return "Partial outage"
    case "major_outage":
      return "Major outage"
    case "maintenance":
      return "Scheduled maintenance"
    default:
      return "Loading status…"
  }
}

function statusColorVars(s?: Props["overallStatus"]) {
  // Use design tokens, avoid raw colors
  switch (s) {
    case "operational":
      return { bg: "var(--color-chart-2)", text: "var(--color-sidebar-primary-foreground)" }
    case "degraded":
      return { bg: "var(--color-chart-5)", text: "var(--color-sidebar-primary-foreground)" }
    case "partial_outage":
      return { bg: "var(--color-chart-4)", text: "var(--color-sidebar-primary-foreground)" }
    case "major_outage":
      return { bg: "var(--color-destructive)", text: "var(--color-destructive-foreground)" }
    case "maintenance":
      return { bg: "var(--color-muted)", text: "var(--color-muted-foreground)" }
    default:
      return { bg: "var(--color-muted)", text: "var(--color-muted-foreground)" }
  }
}

export function Summary({ loading, error, overallStatus, updatedAt, avgResponseMs }: Props) {
  const { bg, text } = statusColorVars(overallStatus)

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3">
        <span aria-hidden className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: bg }} />
        <p className="text-pretty text-sm md:text-base">{statusLabel(overallStatus)}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
        <div className={cn("flex items-center gap-2")}>
          <span className="opacity-80">Last updated:</span>
          <time dateTime={updatedAt}>{updatedAt ? new Date(updatedAt).toLocaleString() : "—"}</time>
        </div>
        <div className="flex items-center gap-2">
          <span className="opacity-80">Avg response:</span>
          <span>{Number.isFinite(avgResponseMs) ? `${avgResponseMs} ms` : "—"}</span>
        </div>
        {!loading && error && (
          <span
            className="rounded-md px-2 py-1 text-xs"
            style={{ backgroundColor: "var(--color-destructive)", color: "var(--color-destructive-foreground)" }}
          >
            Error loading status
          </span>
        )}
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"
import { MonitorStatus } from "@/generated/prisma/enums"

type Item = {
  id: string
  name: string
  status: MonitorStatus
  uptime30d: number
  responseMs?: number
}

export function ComponentsHealth({ items, loading }: { items: Item[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-4 w-2/3" />
            <div className="mt-3 flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    )
  }
  console.log(items)

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((c) => (
        <div key={c.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                aria-hidden
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: colorFor(c.status) }}
              />
              <h3 className="text-sm font-medium">{c.name}</h3>
            </div>
            {/* <span className="text-xs text-muted-foreground">{c.uptime30d.toFixed(2)}% uptime</span> */}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {c.responseMs ? `${c.responseMs} ms avg response` : "—"}
          </div>
        </div>
      ))}
    </div>
  )
}

function colorFor(s: Item["status"]): string {
  switch (s) {
    case "UP":
      return "var(--color-chart-2)"
    // case "":
    //   return "var(--color-chart-5)"
    case "UNKNOWN":
      return "var(--color-chart-4)"
    case "DOWN":
      return "var(--color-destructive)"
    case "PAUSED":
      return "var(--color-muted)"
  }
}

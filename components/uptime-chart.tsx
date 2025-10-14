"use client"

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

type Datum = { date: string; uptime: number }

export function UptimeChart({ data, loading }: { data: Datum[]; loading?: boolean }) {
  if (loading) {
    return <div className="h-28 rounded-md border" />
  }

  if (!data.length) {
    return <p className="text-sm text-muted-foreground">No uptime data available.</p>
  }

  const stroke = "var(--color-chart-2)"
  const fill = "color-mix(in oklab, var(--color-chart-2), transparent 80%)"

  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="uptimeFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.24} />
              <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={6}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            domain={[95, 100]}
            tickFormatter={(v) => `${v}%`}
            tickLine={false}
            axisLine={false}
            width={28}
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ stroke: "var(--color-ring)", strokeWidth: 1 }}
            contentStyle={{
              background: "var(--color-card)",
              borderColor: "var(--color-border)",
              color: "var(--color-foreground)",
              borderRadius: "var(--radius-md)",
            }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, "Uptime"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Area type="monotone" dataKey="uptime" stroke={stroke} fill="url(#uptimeFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

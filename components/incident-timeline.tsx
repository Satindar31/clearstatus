import { Incident, Updates } from "@/generated/prisma/client";
import { IncidentSeverity, IncidentStatus } from "@/generated/prisma/enums";
import { Fragment } from "react";

export function IncidentTimeline({
  items,
  loading,
}: {
  items: {
    id: string;
    title: string;
    description: string | null;
    status: IncidentStatus;
    severity: IncidentSeverity;
    createdAt: Date;
    updatedAt: Date;
    resolvedAt: Date | null;
    statusPageId: string;
    reportedById: string;
    Updates: Updates[];
  }[];
  loading?: boolean;
}) {
  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading incidents…</p>;
  }

  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No incidents in the past 30 days.
      </p>
    );
  }

  return (
    <ol className="space-y-6">
      {items.map((inc) => (
        <li key={inc.id} className="rounded-lg border p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span
                className="rounded-md px-2 py-1 text-xs"
                style={{
                  backgroundColor: bgFor(inc.severity),
                  color: fgFor(inc.severity),
                }}
              >
                {inc.severity}
              </span>
              <h3 className="text-sm font-medium">{inc.title}</h3>
            </div>
            <div className="text-xs text-muted-foreground">
              <time dateTime={new Date(inc.createdAt).toISOString()}>
                {new Date(inc.createdAt).toLocaleString()}
              </time>
              {inc.resolvedAt && (
                <Fragment>
                  {" — "}
                  <time dateTime={new Date(inc.resolvedAt).toISOString()}>
                    {new Date(inc.resolvedAt).toLocaleString()}
                  </time>
                </Fragment>
              )}
            </div>
          </div>

          {/* <div className="mt-2 text-xs text-muted-foreground">Affected: {inc.affectedComponents.join(", ")}</div> */}
          <div className="mt-3 space-y-2">
            {inc.Updates.map((u, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span
                  className="mt-1 inline-block h-1.5 w-1.5 rounded-full"
                  style={{ backgroundColor: dotFor(inc.status) }}
                />
                <div className="text-sm">
                  <p className="leading-6">{u.title}</p>
                  <time
                    className="text-xs text-muted-foreground"
                    dateTime={u.createdAt instanceof Date ? u.createdAt.toISOString() : u.createdAt}
                  >
                    {new Date(u.createdAt).toLocaleString()}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
}

function bgFor(sev: Incident["severity"]) {
  switch (sev.toLocaleLowerCase()) {
    case "critical":
      return "var(--color-destructive)";
    case "major":
      return "var(--color-chart-4)";
    case "minor":
      return "var(--color-chart-5)";
    //   case "maintenance":
    //     return "var(--color-muted)"
    // }
  }
}

function fgFor(sev: Incident["severity"]) {
  switch (sev.toLocaleLowerCase()) {
    case "critical":
      return "var(--color-destructive-foreground)";
    case "major":
      return "var(--color-sidebar-primary-foreground)";
    case "minor":
      return "var(--color-sidebar-primary-foreground)";
    case "maintenance":
      return "var(--color-muted-foreground)";
  }
}
function dotFor(status: Incident["status"]) {
  switch (status.toLocaleLowerCase()) {
    case "resolved":
      return "var(--color-chart-2)";
    case "monitoring":
      return "var(--color-chart-5)";
    case "identified":
      return "var(--color-chart-4)";
    case "investigating":
      return "var(--color-primary)";
  }
}

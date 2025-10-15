import { StatusPage, Monitor, Incident } from "@/types";
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { Checkbox } from "../ui/checkbox";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface IncidentListProps {
  incidents: Incident[];
  onUpdate: () => void;
}

const severityColors = {
  minor: 'bg-amber-100 text-amber-700 border-amber-200',
  major: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const statusColors = {
  INVESTIGATING: 'text-red-600',
  IDENTIFIED: 'text-orange-600',
  MONITORING: 'text-blue-600',
  RESOLVED: 'text-emerald-600',
};

const statusIcons = {
  INVESTIGATING: AlertCircle,
  IDENTIFIED: AlertCircle,
  MONITORING: Clock,
  RESOLVED: CheckCircle,
};

const statusLabels = {
  investigating: 'Investigating',
  identified: 'Identified',
  monitoring: 'Monitoring',
  resolved: 'Resolved',
};

export function IncidentList({ incidents }: IncidentListProps) {
  if (incidents.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">All systems operational</h3>
        <p className="text-slate-600">No incidents to report</p>
      </div>
    );
  }

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');
  const resolvedIncidents = incidents.filter(i => i.status === 'RESOLVED');

  const router = useRouter();

  function handleResolveIncident(incidentId: string) {
    fetch('/api/incidents/resolve', {
      method: 'POST',
      body: JSON.stringify({ incidentId }),
    }).then(() => {
      window.location.reload();
    });
  }

  return (
    <div className="space-y-6">
      {activeIncidents.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Active Incidents</h3>
          {activeIncidents.map((incident) => {
            const StatusIcon = statusIcons[incident.status.toUpperCase() as keyof typeof statusIcons];
            return (
              <div
                key={incident.id}
                className="bg-white border-2 border-red-200 rounded-xl p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    {/* <StatusIcon className={`w-6 h-6 ${statusColors[incident.status.toUpperCase() as keyof typeof statusColors]} mt-0.5`} /> */}
                    <div className="flex-1">
                      <Link href={`/dashboard/updates/${incident.id}`} className="font-semibold text-slate-900 mb-1">{incident.title}</Link>
                      <p className="text-sm text-slate-600 mb-3">{incident.description}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span>Started {new Date(incident.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <form action={() => { handleResolveIncident(incident.id); }} className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityColors[incident.severity.toLowerCase() as keyof typeof severityColors]}`}>
                      {incident.severity.toUpperCase()}
                    </span>
                    <Checkbox type="submit" className={`${statusColors[incident.status.toLowerCase() as keyof typeof statusColors]}`} />
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {resolvedIncidents.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-slate-900">Recent Resolved Incidents</h3>
          {resolvedIncidents.slice(0, 5).map((incident) => (
            <div
              key={incident.id}
              className="bg-white border border-slate-200 rounded-xl p-5 opacity-75"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div className="flex-1">
                    <Link href={`/dashboard/updates/${incident.id}`} className="font-semibold text-slate-900 mb-1">{incident.title}</Link>
                    <div className="text-sm text-slate-600">
                      Resolved {incident.updatedAt && new Date(incident.updatedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityColors[incident.severity.toLowerCase() as keyof typeof severityColors]}`}>
                  {incident.severity.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

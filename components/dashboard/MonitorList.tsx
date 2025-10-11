import { StatusPage, Monitor, Incident } from "@/types";
import { Activity, Globe, ExternalLink } from 'lucide-react';
import { toast } from "sonner";

interface MonitorListProps {
  monitors: Monitor[];
  onUpdate: () => void;
}

const statusColors: Record<string, string> = {
  UP: 'bg-emerald-500',
  DEGRADED: 'bg-amber-500',
  DOWN: 'bg-red-500',
  MAINTENANCE: 'bg-blue-500',
};

const statusLabels: Record<string, string> = {
  UP: 'Operational',
  DEGRADED: 'Degraded Performance',
  DOWN: 'Down',
  MAINTENANCE: 'Under Maintenance',
};

export function MonitorList({ monitors }: MonitorListProps) {
  if (monitors.length === 0) {
    return (
      <div className="text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
        <Activity className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-slate-900 mb-2">No monitors yet</h3>
        <p className="text-slate-600">Add your first monitor to start tracking service status</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {monitors
        .map((monitor) => (
          <div
            key={monitor.id}
            className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-3 h-3 rounded-full ${statusColors[monitor.status]}`} />
                  <h3 onClick={(e) =>{ window.navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_BASE_URL}/api/incidents/webhooks/${monitor.uptimeChecker?.toLocaleLowerCase()}/${monitor.Webhook?.slug}`); toast.info("Webhook URL copied to clipboard"); }} className="font-semibold text-slate-900">{monitor.name}</h3>
                  <span className="text-sm text-slate-500">{statusLabels[monitor.status]}</span>
                </div>
                {monitor.description && (
                  <p className="text-sm text-slate-600 ml-6 mb-2">{monitor.description}</p>
                )}
                {monitor.url && (
                  <div className="flex items-center gap-2 ml-6 text-sm text-slate-500">
                    <Globe className="w-4 h-4" />
                    <a
                      href={monitor.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-emerald-600 transition-colors flex items-center gap-1"
                    >
                      {monitor.url}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                {monitor.monitorType !== 'CUSTOM' && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                    {monitor.monitorType}
                  </span>
                )}
                {!monitor.isVisible && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    Hidden
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

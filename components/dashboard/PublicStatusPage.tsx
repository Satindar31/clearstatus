import { useState, useEffect } from 'react';
import { Activity, Clock, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { StatusPage, Monitor, Incident } from "@/types";

interface PublicStatusPageProps {
  slug: string;
}

const statusColors = {
  operational: 'bg-emerald-500',
  degraded: 'bg-amber-500',
  down: 'bg-red-500',
  maintenance: 'bg-blue-500',
};

const statusLabels = {
  operational: 'All Systems Operational',
  degraded: 'Degraded Performance',
  down: 'Service Disruption',
  maintenance: 'Under Maintenance',
};

const severityColors = {
  minor: 'bg-amber-100 text-amber-700 border-amber-200',
  major: 'bg-orange-100 text-orange-700 border-orange-200',
  critical: 'bg-red-100 text-red-700 border-red-200',
};

const statusIcons = {
  investigating: AlertCircle,
  identified: AlertCircle,
  monitoring: Clock,
  resolved: CheckCircle,
};

export function PublicStatusPage({ slug }: PublicStatusPageProps) {
  const [statusPage, setStatusPage] = useState<StatusPage | null>(null);
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStatusPage();
  }, [slug]);

  const loadStatusPage = async () => {
    setLoading(false);
    setError('Status page not found');
  };

  const getOverallStatus = () => {
    if (monitors.length === 0) return 'operational';
    const statuses = monitors.map(m => m.status);
    if (statuses.includes('DOWN')) return 'down';
    if (statuses.includes('UNKNOWN')) return 'degraded';
    if (statuses.includes('PAUSED')) return 'maintenance';
    return 'operational';
  };

  const activeIncidents = incidents.filter(i => i.status !== 'RESOLVED');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error || !statusPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Status Page Not Found</h1>
          <p className="text-slate-600">The requested status page does not exist.</p>
        </div>
      </div>
    );
  }

  const overallStatus = getOverallStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-600 p-4 rounded-2xl">
              <Activity className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">{statusPage.title}</h1>
          {statusPage.description && (
            <p className="text-lg text-slate-600 mb-6">{statusPage.description}</p>
          )}

          <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
            overallStatus === 'operational'
              ? 'bg-emerald-100 text-emerald-700'
              : overallStatus === 'down'
              ? 'bg-red-100 text-red-700'
              : overallStatus === 'degraded'
              ? 'bg-amber-100 text-amber-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            <div className={`w-3 h-3 rounded-full ${statusColors[overallStatus]}`} />
            <span className="font-semibold">{statusLabels[overallStatus]}</span>
          </div>
        </div>

        {activeIncidents.length > 0 && (
          <div className="mb-8 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Active Incidents</h2>
            {activeIncidents.map((incident) => {
              const StatusIcon = statusIcons[incident.status.toUpperCase() as keyof typeof statusIcons];
              return (
                <div key={incident.id} className="bg-white rounded-2xl border-2 border-red-200 p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <StatusIcon className="w-6 h-6 text-red-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-bold text-slate-900">{incident.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${severityColors[incident.severity.toLowerCase() as keyof typeof severityColors]}`}>
                          {incident.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-slate-700 mb-3">{incident.description}</p>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Calendar className="w-4 h-4" />
                        <span>Started {new Date(incident.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">Service Status</h2>
          </div>

          {monitors.length === 0 ? (
            <div className="p-12 text-center">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">No monitors configured yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {monitors
                .filter(m => m.isVisible)
                .map((monitor) => (
                  <div key={monitor.id} className="p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">{monitor.name}</h3>
                        {monitor.description && (
                          <p className="text-sm text-slate-600">{monitor.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${statusColors[
                          monitor.status === 'UP'
                            ? 'operational'
                            : monitor.status === 'DOWN'
                            ? 'down'
                            : monitor.status === 'UNKNOWN'
                            ? 'degraded'
                            : monitor.status === 'PAUSED'
                            ? 'maintenance'
                            : 'operational'
                        ]}`} />
                        <span className="text-sm font-medium text-slate-700">
                          {monitor.status === 'UP' ? 'Operational' :
                           monitor.status === 'UNKNOWN' ? 'Degraded' :
                           monitor.status === 'DOWN' ? 'Down' :
                           'Maintenance'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>Last updated: {new Date().toLocaleString()}</p>
          <p className="mt-2">Powered by StatusHub</p>
        </div>
      </div>
    </div>
  );
}

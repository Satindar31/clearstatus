import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Settings,
  ExternalLink,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { StatusPage, Monitor, Incident } from "@/types";
import { MonitorList } from "./MonitorList";
import { IncidentList } from "./IncidentList";
import { CreateMonitor } from "./CreateMonitor";
import { CreateIncident } from "./CreateIncident";

interface StatusPageManagerProps {
  statusPage: StatusPage;
  onBack: () => void;
}

export function StatusPageManager({
  statusPage,
  onBack,
}: StatusPageManagerProps) {
  const [activeTab, setActiveTab] = useState<
    "monitors" | "incidents" | "settings"
  >("monitors");
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [showCreateMonitor, setShowCreateMonitor] = useState(false);
  const [showCreateIncident, setShowCreateIncident] = useState(false);

  useEffect(() => {
    loadMonitors();
    loadIncidents();
  }, []);

  const loadMonitors = async () => {
    fetch(`/api/monitors/list?statusPageId=${statusPage.id}`, {
      next: {
        revalidate: 20, // Revalidate every 20 seconds
      }
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setMonitors(data);
        } else {
          setMonitors([]);
        }
      })
      .catch((err) => {
        console.error("Error loading monitors:", err);
        setMonitors([]);
      });
  };

  const loadIncidents = async () => {
    fetch(`/api/incidents?statusPageId=${statusPage.id}`, {
      next: {
        revalidate: 20, // Revalidate every 10 seconds
      }
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          setIncidents(data);
        } else {
          setIncidents([]);
        }
      })
      .catch((err) => {
        console.error("Error loading incidents:", err);
        setIncidents([]);
      });
  };

  const handleMonitorCreated = (monitor: Monitor) => {
    setMonitors([...monitors, monitor]);
    setShowCreateMonitor(false);
  };

  const handleIncidentCreated = (incident: Incident) => {
    setIncidents([incident, ...incidents]);
    setShowCreateIncident(false);
  };

  const publicUrl = `${window.location.origin}/status/${statusPage.slug}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {statusPage.title}
                </h1>
                <p className="text-sm text-slate-600">/{statusPage.slug}</p>
              </div>
            </div>
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Public Page
            </a>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab("monitors")}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "monitors"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <TrendingUp className="w-5 h-5" />
                Monitors
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                  {monitors.length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("incidents")}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "incidents"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                Incidents
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                  {incidents.filter((i) => i.status !== "RESOLVED").length}
                </span>
              </button>
              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors ${
                  activeTab === "settings"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Settings className="w-5 h-5" />
                Settings
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "monitors" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Monitors
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">
                      Track the status of your services
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateMonitor(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Monitor
                  </button>
                </div>
                {showCreateMonitor ? (
                  <CreateMonitor
                    statusPageId={statusPage.id}
                    onCancel={() => setShowCreateMonitor(false)}
                    onCreated={(monitor) =>
                      handleMonitorCreated({
                        ...monitor,
                        monitorType: (monitor as any).monitorType ?? (monitor as any).type,
                        description: monitor.description ?? undefined,
                        createdAt: (monitor.createdAt instanceof Date ? monitor.createdAt.toISOString() : monitor.createdAt),
                        updatedAt: (monitor.updatedAt instanceof Date ? monitor.updatedAt.toISOString() : monitor.updatedAt),
                      })
                    }
                  />
                ) : (
                  <MonitorList monitors={monitors} onUpdate={loadMonitors} />
                )}
              </>
            )}

            {activeTab === "incidents" && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Incidents
                    </h2>
                    <p className="text-slate-600 text-sm mt-1">
                      Report and manage service incidents
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreateIncident(true)}
                    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Report Incident
                  </button>
                </div>
                {showCreateIncident ? (
                  <CreateIncident
                    statusPageId={statusPage.id}
                    monitors={monitors}
                    onCancel={() => setShowCreateIncident(false)}
                    onCreated={handleIncidentCreated}
                  />
                ) : (
                  <IncidentList
                    incidents={incidents}
                    onUpdate={loadIncidents}
                  />
                )}
              </>
            )}

            {activeTab === "settings" && (
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Settings
                </h2>
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">
                      Public URL
                    </h3>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded text-sm">
                        {publicUrl}
                      </code>
                      <button
                        onClick={() => navigator.clipboard.writeText(publicUrl)}
                        className="px-4 py-2 text-sm bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      Integration API
                    </h3>
                    <p className="text-sm text-blue-700 mb-3">
                      Connect external uptime monitors like UptimeRobot to
                      automatically update your status page
                    </p>
                    <code className="block px-3 py-2 bg-white border border-blue-200 rounded text-sm text-slate-700">
                      POST /api/webhook/{statusPage.id}
                    </code>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

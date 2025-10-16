import { Monitor } from "@/generated/prisma/client";
import { MonitorStatus } from "@/generated/prisma/enums";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CreateMonitorProps {
  statusPageId: string;
  onCancel: () => void;
  onCreated: (monitor: Monitor) => void;
  checkers: string[];
}

export function CreateMonitor({
  statusPageId,
  onCancel,
  onCreated,
  checkers,
}: CreateMonitorProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [monitorType, setMonitorType] = useState("hetrixtools");
  const [status, setStatus] = useState<MonitorStatus>("UP");
  const [isVisible, setIsVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    fetch("/api/monitors/create", {
      method: "POST",
      body: JSON.stringify({
        statusPageId,
        name,
        description,
        url,
        monitorType,
        status,
        isVisible,
      }),
    }).then(async (res) => {
      setLoading(false);
      if (res.ok) {
        const newMonitor = (await res.json()) as Monitor;
        onCreated(newMonitor);
        // Create associated webhook
        fetch("/api/incidents/webhooks/createWebhook", {
          method: "POST",
          body: JSON.stringify({
            checker: monitorType,
            monitorId: newMonitor.id,
            statusPageId,
          }),
        }).then(async (res) => {
          if (res.ok) {
            const webhook = await res.json();
            toast.success(
              "Monitor and webhook created successfully. Use this webhook URL in Hetrixtools: " +
                `${
                  process.env.NEXT_PUBLIC_BASE_URL
                }/api/incidents/webhooks/${webhook.uptimeChecker.toLowerCase()}/${
                  webhook.slug
                }`,
              {
                action: {
                  label: "Copy URL",
                  onClick: async () => {
                    window.navigator.clipboard.writeText(
                      `${
                        process.env.NEXT_PUBLIC_BASE_URL
                      }/api/incidents/webhooks/${webhook.uptimeChecker.toLowerCase()}/${
                        webhook.slug
                      }`
                    );
                  },
                },
              }
            );
            onCreated(newMonitor);
          }
        });
      } else {
        toast.error("Failed to create monitor");
        console.error("Failed to create monitor");
      }
    });
    return;
  };

  return (
    <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Add New Monitor</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Monitor Name *
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="API Server"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Main API endpoint"
          />
        </div>

        {/* <div>
          <label
            htmlFor="url"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Webhook URL
          </label>
          <p
            id="url"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            {url}
          </p>
        </div> */}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="monitorType"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Monitor Type
            </label>
            <select
              id="monitorType"
              value={monitorType}
              onChange={(e) => setMonitorType(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              {checkers.map((checker) => (
                <option key={checker} value={checker.toLowerCase()}>
                  {checker.charAt(0).toUpperCase() +
                    checker.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Initial Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as MonitorStatus)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="operational">Operational</option>
              <option value="degraded">Degraded</option>
              <option value="down">Down</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isVisible"
            type="checkbox"
            checked={isVisible}
            onChange={(e) => setIsVisible(e.target.checked)}
            className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
          />
          <label htmlFor="isVisible" className="text-sm text-slate-700">
            Show on public status page
          </label>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Adding..." : "Add Monitor"}
          </button>
        </div>
      </form>
    </div>
  );
}

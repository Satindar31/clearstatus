import { useState } from 'react';
import { Monitor, Incident} from "@/types";

import { toast } from 'sonner';
import { IncidentSeverity, IncidentStatus } from '@/generated/prisma/enums';

interface CreateIncidentProps {
  statusPageId: string;
  monitors: Monitor[];
  onCancel: () => void;
  onCreated: (incident: Incident) => void;
}

export function CreateIncident({ statusPageId, onCancel, onCreated }: CreateIncidentProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<IncidentStatus>('INVESTIGATING');
  const [severity, setSeverity] = useState<IncidentSeverity>('MINOR');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newIncident: Incident = {
      id: crypto.randomUUID(),
      statusPageId: statusPageId,
      title,
      description,
      status,
      severity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      reportedBy: null as any, // This will be set by the backend
      monitors: [], // Later, we can add monitor associations if needed
    };

    fetch("/api/incidents", {
      method: "POST",
      body: JSON.stringify(newIncident),
    }).then(async (res) => {
      setLoading(false);
      if (res.ok) {
        const incident = await res.json();
        onCreated(incident);
        toast.success("Incident created successfully");
      } else {
        // Handle error (e.g., show notification)
        console.error("Failed to create incident");
        toast.error("Failed to create incident");
      }
    }).catch((err) => {
      setLoading(false);
      console.error("Error creating incident:", err);
      toast.error("Error creating incident");
    });
  }

  return (
    <div className="bg-slate-50 rounded-xl p-6 border-2 border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Report New Incident</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Incident Title *
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            placeholder="Database connectivity issues"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            placeholder="We are currently experiencing issues with database connectivity..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-slate-700 mb-1">
              Severity *
            </label>
            <select
              id="severity"
              value={severity}
              onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="MINOR">Minor</option>
              <option value="MAJOR">Major</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">
              Status *
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as IncidentStatus)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            >
              <option value="INVESTIGATING">Investigating</option>
              <option value="IDENTIFIED">Identified</option>
              <option value="MONITORING">Monitoring</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>
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
            {loading ? 'Creating...' : 'Create Incident'}
          </button>
        </div>
      </form>
    </div>
  );
}

import { Organization, User, Webhook } from "@/generated/prisma/client";
import {
  IncidentSeverity,
  IncidentStatus,
  MonitorStatus,
  MonitorType,
  UptimeChecker,
} from "@/generated/prisma/enums";

export interface StatusPage {
  id: string;
  authorId: string;
  title: string;
  slug: string;
  description?: string;
  organization?: Organization | null;
  organization_id?: string | null;
  Incident?: Incident[];
  Monitor?: Monitor[];
  Webhook?: Webhook[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Monitor {
  id: string;
  statusPageId: string;
  name: string;
  description?: string;
  monitorType: MonitorType;
  uptimeChecker?: UptimeChecker
  url?: string;
  status: MonitorStatus;
  Webhook?: Webhook
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MonitorCheck {
  id: string;
  monitor_id: string;
  status: MonitorStatus;
  response_time?: number;
  checked_at: string;
  created_at: string;
}

export interface Incident {
  id: string;
  statusPageId: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  reportedBy: User;
  monitors: Monitor[];
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentUpdate {
  id: string;
  incident_id: string;
  message: string;
  status: IncidentStatus;
  created_at: string;
}
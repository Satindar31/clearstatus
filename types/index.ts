import { Organization, Webhook } from '@/generated/prisma/client';
import { MonitorStatus, MonitorType } from '@/generated/prisma/enums';
export type IncidentStatus = 'INVESTIGATING' | 'IDENTIFIED' | 'MONITORING' | 'RESOLVED';
export type IncidentSeverity = 'MINOR' | 'MAJOR' | 'CRITICAL';

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
  url?: string;
  status: MonitorStatus;
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
  status_page_id: string;
  title: string;
  description: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  started_at: string;
  resolved_at?: string;
  created_at: string;
  updated_at: string;
}

export interface IncidentUpdate {
  id: string;
  incident_id: string;
  message: string;
  status: IncidentStatus;
  created_at: string;
}

import type { ConversationStat } from "@/src/domain/conversation";

export type { Client, ContactStatus } from "@/src/domain/client";
export type { Project, ProjectStatus, Priority } from "@/src/domain/project";
export type { Lead, LeadStatus } from "@/src/domain/lead";
export type { Ticket, TicketStatus } from "@/src/domain/ticket";
export type { User, UserRole } from "@/src/domain/user";
export type {
  Document,
  DocumentFolder,
  DocumentKind,
} from "@/src/domain/document";
export type { Automation } from "@/src/domain/automation";
export type { Conversation, ConversationStat } from "@/src/domain/conversation";
export type { Invoice } from "@/src/domain/invoice";
export type { Offer } from "@/src/domain/offer";

export interface ActivityItem {
  id: string;
  time: string;
  text: string;
}

export interface TaskItem {
  id: string;
  text: string;
  due: string;
}

export interface ApiKeyRecord {
  id: string;
  name: string;
  masked: string;
  created: string;
}

export interface IntegrationRecord {
  id: string;
  name: string;
  status: string;
}

export interface OrganizationSettings {
  name: string;
  address: string;
}

export interface AiOverview {
  conversations: number;
  successRate: string;
  timeSaved: string;
  automations: number;
  topQuestions: ConversationStat[];
}

export interface DashboardSummary {
  activeProjects: number;
  newClients: number;
  openTickets: number;
  automations: number;
  revenue: string;
  tasks: TaskItem[];
  activity: ActivityItem[];
}

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function ok<T>(data: T): Result<T> {
  return { ok: true, data };
}

export function err<T = never>(error: string): Result<T> {
  return { ok: false, error };
}

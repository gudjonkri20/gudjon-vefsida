export type Locale = 'en' | 'is';

export type Localized<T = string> = Record<Locale, T>;

export type ProjectStatus = 'public' | 'internal' | 'research' | 'side';

export type ProjectCategory =
  | 'chatbot'
  | 'mcp'
  | 'ml'
  | 'automation'
  | 'dashboards'
  | 'data-eng'
  | 'research'
  | 'side';

export interface Project {
  slug: string;
  title: Localized;
  tagline: Localized;
  description: Localized;
  status: ProjectStatus;
  category: ProjectCategory;
  tech: string[];
  link?: string;
  linkLabel?: Localized;
  isFeatured: boolean;
  hasDetailPage: boolean;
  year?: number;
}

export type ServiceSlug = 'audit' | 'implementation' | 'training';

export interface Service {
  slug: ServiceSlug;
  title: Localized;
  tagline: Localized;
  description: Localized;
  bullets: Localized<string[]>;
  format: Localized;
  emailSubject: Localized;
}

export interface NavItem {
  key: string;
  path: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

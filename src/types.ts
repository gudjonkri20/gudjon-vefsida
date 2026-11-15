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
  /**
   * Optional. Drawn as a diagram on the project's page: what sits at the
   * centre, what it connects to, and a few facts about the whole. Only put
   * here what is already public about the project.
   */
  system?: ProjectSystem;
}

export interface ProjectSystem {
  /** Who or what starts it: "Visitor", "Partner email", … */
  input: Localized;
  /** The thing at the centre: "Tool-using LLM", … */
  core: Localized;
  /** What the centre reaches out to. Three to six reads best. */
  parts: Localized[];
  /** Short facts about the whole, shown under the diagram. */
  notes?: Localized[];
}

export type ServiceSlug = 'advisory' | 'training';

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

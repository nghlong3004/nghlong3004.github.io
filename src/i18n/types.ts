export type Language = "en" | "vi";

export interface NavTranslation {
  story: string;
  experience: string;
  projects: string;
  impact: string;
  honors: string;
  contact: string;
}

export interface StoryTranslation {
  eyebrow: string;
  heading: string;
  intro: string;
  principles: readonly {
    index: string;
    title: string;
    body: string;
  }[];
}

export interface ExperienceRoleTranslation {
  company: string;
  role: string;
  period: string;
  current?: boolean;
  initials: string;
  logo?: string;
  logoDark?: string;
  tech: readonly string[];
  highlights: readonly string[];
}

export interface ExperienceTranslation {
  eyebrow: string;
  heading: string;
  currentLabel: string;
  roles: readonly ExperienceRoleTranslation[];
}

export interface ProjectDetailTranslation {
  back: string;
  year: string;
  tech: string;
  description: string;
  role: string;
  visit_website: string;
  view_code: string;
}

export interface ProjectItemTranslation {
  id: string;
  slug: string;
  name: string;
  title: string;
  category: string;
  year: string;
  outcome: string;
  blurb: string;
  image: string;
  techStack: readonly string[];
  liveUrl?: string;
  sourceCode?: string;
  images: readonly string[];
  tagline?: string;
  description: string;
  role?: string;
}

export interface ProjectsTranslation {
  eyebrow: string;
  heading: string;
  counter: string;
  detail: ProjectDetailTranslation;
  projects: readonly ProjectItemTranslation[];
}

export interface ImpactStatTranslation {
  value: string;
  label: string;
}

export interface ImpactTranslation {
  eyebrow: string;
  heading: string;
  stats: readonly ImpactStatTranslation[];
}

export interface HonorItemTranslation {
  id: string;
  index: string;
  text: string;
  name: string;
  role: string;
  image: string;
}

export interface HonorsTranslation {
  eyebrow: string;
  heading: string;
  items: readonly HonorItemTranslation[];
}

export interface ContactTranslation {
  eyebrow: string;
  heading: string;
  intro: string;
  footerTagline: string;
  copyright: string;
  stayConnected: string;
  newsletterDesc: string;
  quickLinks: string;
  contactUs: string;
  followUs: string;
  emailPlaceholder: string;
  subscribeSuccess: string;
  location: string;
}

export interface TranslationDictionary {
  nav: NavTranslation;
  hero: {
    roles: readonly string[];
  };
  marquee: readonly string[];
  story: StoryTranslation;
  experience: ExperienceTranslation;
  projects: ProjectsTranslation;
  impact: ImpactTranslation;
  honors: HonorsTranslation;
  contact: ContactTranslation;
}

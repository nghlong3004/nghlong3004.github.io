export type Language = 'vi' | 'en'
export type PortfolioView = 'about' | 'work' | 'experience' | 'contact'

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }

export interface PortfolioPortrait {
  src: string
  alt: string
  referenceCrop?: boolean
}

export interface PortfolioProfile {
  name: string
  displayName: string
  role: string
  bio: string
  intro: string
  location: string
  email: string
  portrait: PortfolioPortrait
}

export interface PortfolioProject {
  id: string
  title: string
  slug: string
  category: string
  year: string
  outcome: string
  summary: string
  tagline?: string
  image: { src: string; alt: string }
  images: string[]
  techStack: string[]
  liveUrl?: string
  sourceCode?: string
  details: ContentBlock[]
  role: ContentBlock[]
}

export interface PortfolioStory {
  intro: string
  principles: { title: string; body: string }[]
}

export interface PortfolioExperience {
  company: string
  role: string
  period: string
  current?: boolean
  logo?: string
  logoDark?: string
  tech: string[]
  highlights: string[]
}

export interface PortfolioHonor {
  id: string
  name: string
  period: string
  description: string
}

export interface PortfolioImpact {
  value: string
  label: string
}

export interface PortfolioLink {
  label: string
  url: string
  icon: 'mail' | 'github' | 'linkedin' | 'instagram' | 'facebook'
}

export interface PortfolioData {
  profile: PortfolioProfile
  projects: PortfolioProject[]
  links: PortfolioLink[]
  story: PortfolioStory
  experience: PortfolioExperience[]
  honors: PortfolioHonor[]
  impact: PortfolioImpact[]
  ui: PortfolioLabels
}

export interface PortfolioLabels {
  intro: string
  story: string
  experience: string
  projects: string
  impact: string
  honors: string
  contact: string
  open: string
  explore: string
  more: string
  less: string
  live: string
  code: string
  role: string
  current: string
  projectNotification: string
  contactNotification: string
  coverHint: string
  contactHeading: string
  contactIntro: string
  gallery: string
  language: string
  slideReturn: string
  returning: string
  returned: string
  confirmHint: string
}

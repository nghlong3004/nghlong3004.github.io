export interface IProject {
  id: string;
  slug: string;
  title: string;
  name?: string;
  category: string;
  year: string | number;
  outcome?: string;
  blurb?: string;
  image: string;
  thumbnail?: string;
  images: string[];
  liveUrl?: string;
  sourceCode?: string;
  techStack: string[];
  description: string;
  role?: string;
  tagline?: string;
}

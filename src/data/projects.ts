export interface ProjectItem {
  id: string;
  slug: string;
  name: string;
  title: string;
  category: string;
  year: string;
  outcome: string;
  blurb: string;
  image: string;
  images: readonly string[];
  techStack: readonly string[];
  liveUrl?: string;
  sourceCode?: string;
}

export const PROJECTS_DATA = {
  eyebrow: "Selected Projects",
  heading: "The work that shipped.",
  counter: "04 / Projects",
  projects: [
    {
      id: "vinqa",
      slug: "vinqa",
      name: "VinQA",
      title: "VinQA",
      category: "AI Quality Assessment",
      year: "2026",
      outcome: "Team Lead — Backend",
      blurb:
        "AI-assisted platform that scans URLs and generates actionable technical reports. Async Redis workers cut scan submission from ~30s to ~200ms.",
      image: "/project/vinqa.webp",
      liveUrl: "https://a20-app-054.nghlong3004.me/",
      sourceCode: "https://github.com/nghlong3004/vinqa",
      techStack: [
        "Spring Boot",
        "React",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Python",
        "Playwright",
        "Lighthouse",
      ],
      images: [
        "/project/vinqa/vinqa_1.webp",
        "/project/vinqa/vinqa_2.webp",
      ],
    },
    {
      id: "vsf-qc-copilot",
      slug: "vsf-qc-copilot",
      name: "VSF QC Copilot",
      title: "VSF QC Copilot",
      category: "AI Evaluation Platform",
      year: "2026",
      outcome: "Built at Vinsmart Future",
      blurb:
        "An evaluation platform where QC teams configure chatbot/API targets, run AI-assisted evaluations and export results — Spring Boot, Redis workers, Promptfoo.",
      image: "/project/VSF.webp",
      sourceCode: "https://github.com/VSF-QC-TTS/vf-qc-copilot",
      techStack: [
        "Spring Boot",
        "Node.js",
        "Promptfoo",
        "React",
        "Vite",
        "TypeScript",
        "Redis Streams",
        "PostgreSQL",
        "Docker Compose",
      ],
      images: [
        "/project/VSF.webp",
      ],
    },
    {
      id: "olympic-humg",
      slug: "olympic-humg",
      name: "Olympic HUMG",
      title: "Olympic HUMG",
      category: "Education Platform",
      year: "2025",
      outcome: "Full-stack Developer",
      blurb:
        "Practice platform for Olympiad mock exams, team management and study roadmaps — with Google OAuth2, RBAC and a RAG-based chatbot.",
      image: "/project/olympic-humg.webp",
      liveUrl: "https://olympic.humg.edu.vn",
      sourceCode: "https://github.com/nghlong3004/humg-olympic-documentation",
      techStack: [
        "Spring Boot",
        "React",
        "PostgreSQL",
        "Redis",
        "Flyway",
        "Docker",
        "Nginx",
        "OAuth2/JWT",
      ],
      images: [
        "/project/olympic-humg/olympic-humg_1.webp",
        "/project/olympic-humg/olympic-humg_2.webp",
      ],
    },
    {
      id: "boom-online",
      slug: "boom-online",
      name: "Boom Online",
      title: "Boom Online",
      category: "Real-time Multiplayer Game",
      year: "2025",
      outcome: "Java Developer",
      blurb:
        "Real-time multiplayer Bomberman-style game with a Spring Boot WebSocket server, A* pathfinding bots, and Strategy/Observer/Factory design patterns.",
      image: "/project/boom-online.webp",
      sourceCode: "https://github.com/nghlong3004/boom-online",
      techStack: [
        "Spring Boot",
        "WebSocket",
        "Java Swing",
        "PostgreSQL",
        "Flyway",
        "A* Pathfinding",
      ],
      images: [
        "/project/boom-online/boom-1.webp",
        "/project/boom-online/boom-2.webp",
      ],
    },
  ] as const satisfies readonly ProjectItem[],
} as const;

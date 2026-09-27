export interface ProjectItem {
  id: string;
  name: string;
  category: string;
  year: string;
  outcome: string;
  blurb: string;
  image: string;
}

export const PROJECTS_DATA = {
  eyebrow: "Selected Projects",
  heading: "The work that shipped.",
  counter: "04 / Projects",
  projects: [
    {
      id: "vinqa",
      name: "VinQA",
      category: "AI Quality Assessment",
      year: "2026",
      outcome: "Team Lead — Backend",
      blurb:
        "AI-assisted platform that scans URLs and generates actionable technical reports. Async Redis workers cut scan submission from ~30s to ~200ms.",
      image: "/project/vinqa.webp",
    },
    {
      id: "vsf-qc-copilot",
      name: "VSF QC Copilot",
      category: "AI Evaluation Platform",
      year: "2026",
      outcome: "Built at Vinsmart Future",
      blurb:
        "An evaluation platform where QC teams configure chatbot/API targets, run AI-assisted evaluations and export results — Spring Boot, Redis workers, Promptfoo.",
      image: "/project/VSF.webp",
    },
    {
      id: "olympic-humg",
      name: "Olympic HUMG",
      category: "Education Platform",
      year: "2025",
      outcome: "Full-stack Developer",
      blurb:
        "Practice platform for Olympiad mock exams, team management and study roadmaps — with Google OAuth2, RBAC and a RAG-based chatbot.",
      image: "/project/olympic-humg.webp",
    },
    {
      id: "boom-online",
      name: "Boom Online",
      category: "Real-time Multiplayer Game",
      year: "2025",
      outcome: "Java Developer",
      blurb:
        "Real-time multiplayer Bomberman-style game with a Spring Boot WebSocket server, A* pathfinding bots, and Strategy/Observer/Factory design patterns.",
      image: "/project/boom-online.webp",
    },
  ] as const satisfies readonly ProjectItem[],
} as const;

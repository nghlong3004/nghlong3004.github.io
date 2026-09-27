export interface ExperienceItem {
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

export const EXPERIENCE_DATA = {
  eyebrow: "Experience",
  heading: "Where the work happens.",
  roles: [
    {
      company: "VinFast",
      role: "Junior Automation Test",
      period: "07/2026 – Present",
      current: true,
      initials: "VF",
      logo: "/company/VinFast.png",
      logoDark: "/company/VinFast-dark.png",
      tech: ["Java", "Python", "Playwright", "CI/CD", "Langfuse"],
      highlights: [
        "Built automation for research chatbots, knowledge base, ASR/TTS, and API E2E scripts.",
        "Built and maintain CI/CD pipelines with GitLab.",
        "Cut LLM-as-a-Judge costs from ~$1,200 to ~$500.",
        "Designed a reusable testing framework — new tools only need core logic, with a UI instead of CLI commands.",
      ],
    },
    {
      company: "Vinsmart Future",
      role: "Intern",
      period: "04/2026 – 07/2026",
      current: false,
      initials: "VF",
      logo: "/company/VSF.png",
      tech: [
        "Java",
        "Spring Boot",
        "PostgreSQL",
        "Redis",
        "Spring AI",
        "OAuth2/JWT",
        "Docker",
      ],
      highlights: [
        "Translated real QC workflows into platform features and C4 architecture documentation.",
        "Built Spring Boot backend features for projects, target API connectors, datasets, rubrics and evaluation runs.",
        "Implemented async evaluation processing with Redis-backed jobs/workers and Promptfoo execution.",
        "Built secure OAuth2/JWT auth flows with owner-scoped APIs and encrypted API keys.",
      ],
    },
  ] as const satisfies readonly ExperienceItem[],
} as const;

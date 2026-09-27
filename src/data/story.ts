export interface StoryPrinciple {
  index: string;
  title: string;
  body: string;
}

export const STORY_DATA = {
  eyebrow: "The Story",
  heading: "Reliable systems are never an accident.",
  intro:
    "I'm a senior-year engineering student who turned a love of algorithms into real-world backend work. From a real-time multiplayer game with A* bots to an AI-assisted QC platform — and now test automation at VinFast — the through-line never changed: pick the hard problem, design it properly, and measure whether it actually got better.",
  principles: [
    {
      index: "01",
      title: "Design for scale from day one",
      body: "Blocking work belongs in queues, not request threads. I turned a ~30s scan submission into a ~200ms async Redis workflow.",
    },
    {
      index: "02",
      title: "Automate the repetitive",
      body: "Manual checks don't scale. I build reusable test frameworks where new tools only need core logic — with a UI, not just a CLI.",
    },
    {
      index: "03",
      title: "Security is a feature",
      body: "OAuth2/JWT, owner-scoped APIs, encrypted keys, SSRF protection and rate limiting — designed in from the start, never bolted on.",
    },
    {
      index: "04",
      title: "Measure everything",
      body: "If it isn't monitored, it isn't done. Prometheus, Grafana and Langfuse tracing — and LLM-judge costs cut from ~$1,200 to ~$500.",
    },
  ] as const satisfies readonly StoryPrinciple[],
} as const;

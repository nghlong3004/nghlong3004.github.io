export interface ImpactStat {
  value: string;
  label: string;
}

export const IMPACT_DATA = {
  eyebrow: "By The Numbers",
  heading: "Results, measured.",
  stats: [
    {
      value: "4",
      label: "Projects designed & built",
    },
    {
      value: "200ms",
      label: "Scan submission latency, down from ~30s",
    },
    {
      value: "58%",
      label: "Lower LLM-as-a-Judge cost, ~$1,200 to ~$500",
    },
    {
      value: "6",
      label: "National & provincial contest prizes",
    },
  ] as const satisfies readonly ImpactStat[],
} as const;

export interface HonorItem {
  id: string;
  index: string;
  text: string;
  name: string;
  role: string;
  image: string;
}

const ASSET_BASE =
  "https://api.getlayers.ai/storage/v1/object/public/public/assets/marcus-vane-6799bd1fb6";

export const HONORS_DATA = {
  eyebrow: "Honors",
  heading: "Trained on hard problems.",
  items: [
    {
      id: "calculus",
      index: "01",
      text: "Third prize in Calculus at the National Mathematics Olympiad — two years running.",
      name: "Calculus",
      role: "National Mathematics Olympiad · 2025, 2026",
      image: `${ASSET_BASE}/voices/voice-01.webp`,
    },
    {
      id: "linear-algebra",
      index: "02",
      text: "Linear Algebra at the National Mathematics Olympiad: third prize in 2024, fourth prize in 2025.",
      name: "Linear Algebra",
      role: "National Mathematics Olympiad · 2024, 2025",
      image: `${ASSET_BASE}/voices/voice-02.webp`,
    },
    {
      id: "informatics",
      index: "03",
      text: "Second prize in Grade 12 (2023) and fourth prize in Grade 11 (2022) at the Provincial Informatics Contests.",
      name: "Informatics",
      role: "Provincial Contests · 2022, 2023",
      image: `${ASSET_BASE}/voices/voice-03.webp`,
    },
  ] as const satisfies readonly HonorItem[],
} as const;

import type { Language, PortfolioImpact } from '../types'

export const impacts: Record<Language, PortfolioImpact[]> = {
  "vi": [
    {
      "value": "4",
      "label": "Dự án đã thiết kế & phát triển"
    },
    {
      "value": "200ms",
      "label": "Độ trễ khi submit scan, giảm từ ~30s"
    },
    {
      "value": "58%",
      "label": "Giảm chi phí LLM-as-a-Judge, từ ~$1,200 xuống ~$500"
    },
    {
      "value": "6",
      "label": "Giải thưởng cấp Quốc gia & Tỉnh"
    }
  ],
  "en": [
    {
      "value": "4",
      "label": "Projects designed & built"
    },
    {
      "value": "200ms",
      "label": "Scan submission latency, down from ~30s"
    },
    {
      "value": "58%",
      "label": "Lower LLM-as-a-Judge cost, ~$1,200 to ~$500"
    },
    {
      "value": "6",
      "label": "National & provincial contest prizes"
    }
  ]
}

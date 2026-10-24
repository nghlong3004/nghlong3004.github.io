import type { Language, PortfolioImpact } from '../types'

export const impacts: Record<Language, PortfolioImpact[]> = {
  "vi": [
    {
      "value": "4",
      "label": "Dự án đã thiết kế & phát triển"
    },
    {
      "value": "200ms",
      "label": "VinQA · Thời gian gửi yêu cầu quét, từ ~30s"
    },
    {
      "value": "3",
      "label": "Lĩnh vực đạt giải: Giải tích, Đại số, Tin học"
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
      "label": "VinQA · Scan submission time, down from ~30s"
    },
    {
      "value": "3",
      "label": "Award subjects: Calculus, Algebra, Informatics"
    },
    {
      "value": "6",
      "label": "National & provincial contest prizes"
    }
  ]
}

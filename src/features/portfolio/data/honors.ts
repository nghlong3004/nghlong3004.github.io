import type { Language, PortfolioHonor } from '../types'

export const honors: Record<Language, PortfolioHonor[]> = {
  "vi": [
    {
      "id": "calculus",
      "name": "Giải tích",
      "period": "Olympic Toán học Toàn quốc · 2025, 2026",
      "description": "Giành Giải Ba môn Giải tích tại Kỳ thi Olympic Toán học Sinh viên Toàn quốc trong hai năm liên tiếp."
    },
    {
      "id": "linear-algebra",
      "name": "Đại số tuyến tính",
      "period": "Olympic Toán học Toàn quốc · 2024, 2025",
      "description": "Ở môn Đại số tại Olympic Toán học Toàn quốc, mình đạt Giải Ba năm 2024 và Giải Khuyến khích năm 2025."
    },
    {
      "id": "informatics",
      "name": "Tin học",
      "period": "Kỳ thi Học sinh Giỏi cấp Tỉnh · 2022, 2023",
      "description": "Đạt Giải Nhì lớp 12 năm 2023 và Giải Khuyến khích lớp 11 năm 2022 tại Kỳ thi Học sinh Giỏi Tin học cấp Tỉnh."
    }
  ],
  "en": [
    {
      "id": "calculus",
      "name": "Calculus",
      "period": "National Mathematics Olympiad · 2025, 2026",
      "description": "Third prize in Calculus at the National Mathematics Olympiad — two years running."
    },
    {
      "id": "linear-algebra",
      "name": "Linear Algebra",
      "period": "National Mathematics Olympiad · 2024, 2025",
      "description": "Linear Algebra at the National Mathematics Olympiad: third prize in 2024, fourth prize in 2025."
    },
    {
      "id": "informatics",
      "name": "Informatics",
      "period": "Provincial Contests · 2022, 2023",
      "description": "Second prize in Grade 12 (2023) and fourth prize in Grade 11 (2022) at the Provincial Informatics Contests."
    }
  ]
}

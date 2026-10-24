import type { Language, PortfolioExperience } from '../types'

export const experiences: Record<Language, PortfolioExperience[]> = {
  "vi": [
    {
      "company": "VinFast",
      "role": "Đang làm việc tại VinFast",
      "period": "Hiện tại",
      "current": true,
      "logo": "/company/VinFast.png",
      "logoDark": "/company/VinFast-dark.png",
      "tech": [],
      "highlights": []
    },
    {
      "company": "Vinsmart Future",
      "role": "Thực tập sinh",
      "period": "04/2026 – 07/2026",
      "current": false,
      "logo": "/company/VSF.png",
      "tech": [
        "Java",
        "Spring Boot",
        "PostgreSQL",
        "Redis",
        "Spring AI",
        "OAuth2/JWT",
        "Docker"
      ],
      "highlights": [
        "Chuyển các quy trình QC thực tế thành tính năng trên platform và tài liệu C4 architecture.",
        "Xây dựng các tính năng Spring Boot cho projects, target API connectors, datasets, rubrics và evaluation runs.",
        "Triển khai quy trình evaluation bất đồng bộ bằng Redis workers và Promptfoo execution.",
        "Xây dựng luồng xác thực OAuth2/JWT, owner-scoped APIs và cơ chế mã hóa API keys."
      ]
    }
  ],
  "en": [
    {
      "company": "VinFast",
      "role": "Currently working at VinFast",
      "period": "Present",
      "current": true,
      "logo": "/company/VinFast.png",
      "logoDark": "/company/VinFast-dark.png",
      "tech": [],
      "highlights": []
    },
    {
      "company": "Vinsmart Future",
      "role": "Intern",
      "period": "04/2026 – 07/2026",
      "current": false,
      "logo": "/company/VSF.png",
      "tech": [
        "Java",
        "Spring Boot",
        "PostgreSQL",
        "Redis",
        "Spring AI",
        "OAuth2/JWT",
        "Docker"
      ],
      "highlights": [
        "Translated real QC workflows into platform features and C4 architecture documentation.",
        "Built Spring Boot backend features for projects, target API connectors, datasets, rubrics and evaluation runs.",
        "Implemented async evaluation processing with Redis-backed jobs/workers and Promptfoo execution.",
        "Built secure OAuth2/JWT auth flows with owner-scoped APIs and encrypted API keys."
      ]
    }
  ]
}

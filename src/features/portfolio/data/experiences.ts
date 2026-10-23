import type { Language, PortfolioExperience } from '../types'

export const experiences: Record<Language, PortfolioExperience[]> = {
  "vi": [
    {
      "company": "VinFast",
      "role": "Làm việc tại VinFast",
      "period": "07/2026 – Nay",
      "current": true,
      "logo": "/company/VinFast.png",
      "logoDark": "/company/VinFast-dark.png",
      "tech": [
        "Java",
        "Python",
        "Playwright",
        "CI/CD",
        "Langfuse"
      ],
      "highlights": [
        "Xây dựng automation cho research chatbot, knowledge base, ASR/TTS và API E2E scripts.",
        "Xây dựng và duy trì CI/CD pipelines với GitLab.",
        "Giảm chi phí LLM-as-a-Judge từ ~$1,200 xuống ~$500.",
        "Thiết kế framework kiểm thử có thể tái sử dụng — tool mới chỉ cần tập trung vào core logic, đồng thời có UI thay vì phải thao tác hoàn toàn qua CLI."
      ]
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
      "role": "Working at VinFast",
      "period": "07/2026 – Present",
      "current": true,
      "logo": "/company/VinFast.png",
      "logoDark": "/company/VinFast-dark.png",
      "tech": [
        "Java",
        "Python",
        "Playwright",
        "CI/CD",
        "Langfuse"
      ],
      "highlights": [
        "Built automation for research chatbots, knowledge base, ASR/TTS, and API E2E scripts.",
        "Built and maintain CI/CD pipelines with GitLab.",
        "Cut LLM-as-a-Judge costs from ~$1,200 to ~$500.",
        "Designed a reusable testing framework — new tools only need core logic, with a UI instead of CLI commands."
      ]
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

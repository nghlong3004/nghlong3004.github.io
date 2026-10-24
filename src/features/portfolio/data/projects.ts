import type { Language, PortfolioProject } from '../types'

export const projects: Record<Language, PortfolioProject[]> = {
  "vi": [
    {
      "id": "vinqa",
      "slug": "vinqa",
      "title": "VinQA",
      "category": "Đánh Giá Chất Lượng AI",
      "year": "2026",
      "outcome": "Team Lead — Backend",
      "summary": "Nền tảng ứng dụng AI để scan URL và tạo báo cáo kỹ thuật. Async Redis workers giúp giảm thời gian submit scan từ ~30s xuống ~200ms.",
      "tagline": "Nền tảng kiểm thử chất lượng web tự động đa dịch vụ với 9 công cụ quét.",
      "image": {
        "src": "/project/vinqa/header.webp",
        "alt": "Logo VinQA — nền tảng kiểm thử giao diện và chất lượng phần mềm tự động"
      },
      "images": [
        "/project/vinqa/vinqa_1.webp",
        "/project/vinqa/vinqa_2.webp"
      ],
      "techStack": [
        "Spring Boot",
        "React",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Python",
        "Playwright",
        "Lighthouse"
      ],
      "liveUrl": "https://a20-app-054.nghlong3004.me/",
      "sourceCode": "https://github.com/nghlong3004/vinqa",
      "details": [
        {
          "type": "paragraph",
          "text": "Nền tảng kiểm thử chất lượng web tự động đa dịch vụ. Người dùng nhập URL, hệ thống trả về báo cáo QA tổng hợp với điểm số và gợi ý sửa lỗi AI."
        },
        {
          "type": "paragraph",
          "text": "Tính năng chính:"
        },
        {
          "type": "list",
          "items": [
            "Kiến trúc đa dịch vụ: Spring Boot API + Python Worker + React SPA + PostgreSQL + Redis",
            "9 công cụ scan: Accessibility, Performance, Security, SEO, Visual Regression, Content, Console, Functional/UX, Link Checker",
            "Xử lý bất đồng bộ qua Redis Queue (LPUSH/BLPOP)",
            "Mã hóa AES-GCM cho payload nhạy cảm + bảo vệ chống tấn công SSRF",
            "SSE streaming tiến trình thời gian thực",
            "Tích hợp LLM để giải thích lỗi và gợi ý sửa đổi",
            "Giám sát hệ thống với Prometheus và Grafana"
          ]
        }
      ],
      "role": [
        {
          "type": "paragraph",
          "text": "Backend / Full-stack / Kiến trúc hệ thống:"
        },
        {
          "type": "list",
          "items": [
            "Thiết kế và triển khai lớp Spring Boot API: vòng đời quét lỗi, Redis queue producer, lưu trữ PostgreSQL, xác thực JWT/OAuth2, SSE progress streaming",
            "Xây dựng kiến trúc hàng đợi Redis LPUSH/BLPOP, tách biệt API với Python worker",
            "Triển khai mã hóa AES-GCM cho gói tin nhạy cảm và bảo vệ chống tấn công SSRF cho các URL đích",
            "Tích hợp PostgreSQL, Flyway, Redis, Docker Compose, Nginx, Prometheus, Grafana",
            "Phát triển dashboard React + TypeScript phục vụ gửi yêu cầu quét, theo dõi tiến trình trực tiếp, hiển thị báo cáo trực quan"
          ]
        }
      ]
    },
    {
      "id": "vsf-qc-copilot",
      "slug": "vsf-qc-copilot",
      "title": "VSF QC Copilot",
      "category": "Nền Tảng Đánh Giá AI",
      "year": "2026",
      "outcome": "Phát triển tại Vinsmart Future",
      "summary": "Nền tảng evaluation cho phép đội ngũ QC cấu hình chatbot/API targets, chạy đánh giá với AI và export kết quả — sử dụng Spring Boot, Redis workers và Promptfoo.",
      "tagline": "Nền tảng tự động hóa kiểm thử nội bộ đánh giá phản hồi chatbot theo tiêu chí có cấu trúc.",
      "image": {
        "src": "/project/VSF.webp",
        "alt": "VSF QC Copilot — Nền Tảng Đánh Giá AI"
      },
      "images": [
        "/project/VSF.webp"
      ],
      "techStack": [
        "Spring Boot",
        "Node.js",
        "Promptfoo",
        "React",
        "Vite",
        "TypeScript",
        "Redis Streams",
        "PostgreSQL",
        "Docker Compose"
      ],
      "sourceCode": "https://github.com/VSF-QC-TTS/vf-qc-copilot",
      "details": [
        {
          "type": "paragraph",
          "text": "Dự án này là nền tảng tự động hóa kiểm thử nội bộ dành cho đội ngũ QC, được thiết kế để kiểm thử và đánh giá tự động các phản hồi của chatbot thông qua API. Hệ thống sinh ra để giảm bớt quy trình thủ công sử dụng Excel và các công cụ đánh giá tổng hợp bằng AI (all-in-one LLM judge), chuyển hướng sang phương pháp đánh giá có cấu trúc (structured evaluation) dựa trên từng trường, thành phần, công cụ và tiêu chí đánh giá (rubric) cụ thể."
        },
        {
          "type": "paragraph",
          "text": "Kiến Trúc Hệ Thống (Microservices Monorepo):"
        },
        {
          "type": "list",
          "items": [
            "Frontend SPA (apps/client): React, Vite, TypeScript — giao diện cho đội ngũ QC để quản lý dự án, cấu hình mục tiêu kiểm thử, tạo dữ liệu kiểm thử (test cases) bằng AI, và đánh giá kết quả chạy kiểm thử (run reports).",
            "Backend API (apps/api): Java Spring Boot — cung cấp API lõi, quản lý logic nghiệp vụ, quản lý vòng đời đánh giá, phối hợp với các LLM, và đẩy các tác vụ kiểm thử (jobs) vào hàng đợi Redis Streams.",
            "Evaluation Runner (apps/runner): Node.js — consumer nhận task từ Redis, gọi API chatbot, chuẩn hóa response, chạy assertions/evaluations bằng promptfoo và trả kết quả về Backend API.",
            "Hạ tầng dữ liệu: PostgreSQL lưu trữ dữ liệu nghiệp vụ, Redis Streams làm hàng đợi cho runner."
          ]
        },
        {
          "type": "paragraph",
          "text": "Điểm nổi bật kỹ thuật:"
        },
        {
          "type": "list",
          "items": [
            "Chạy kiểm thử tự động nhiều kịch bản, assertion đa tầng (regex, semantic similarity, LLM rubric judge)",
            "Tài liệu thiết kế kiến trúc chuẩn C4 Model, LLD, ADRs và API specs chi tiết",
            "Hỗ trợ khởi tạo toàn bộ hạ tầng cục bộ (local) với Docker Compose"
          ]
        }
      ],
      "role": [
        {
          "type": "paragraph",
          "text": "Backend Development & Tích hợp hệ thống tại Vinsmart Future:"
        },
        {
          "type": "list",
          "items": [
            "Thiết kế và xây dựng Spring Boot Backend API quản lý dự án kiểm thử, cấu hình test suites, target APIs và vòng đời evaluation runs.",
            "Xây dựng kiến trúc message queue với Redis Streams để phân phối tác vụ kiểm thử bất đồng bộ cho Node.js Runner.",
            "Thiết kế cơ sở dữ liệu PostgreSQL và quản lý dữ liệu test cases, rubrics, metrics kết quả.",
            "Soạn thảo tài liệu kỹ thuật hoàn chỉnh: C4 Model Architecture, LLD, ADRs và tài liệu bàn giao sản phẩm."
          ]
        }
      ]
    },
    {
      "id": "olympic-humg",
      "slug": "olympic-humg",
      "title": "Olympic HUMG",
      "category": "Nền Tảng Giáo Dục",
      "year": "2025",
      "outcome": "Full-stack Developer",
      "summary": "Nền tảng luyện thi Olympic, quản lý đội tuyển và xây dựng lộ trình học tập — tích hợp Google OAuth2, RBAC và chatbot sử dụng RAG.",
      "tagline": "Nền tảng luyện tập trực tuyến và quản lý đội tuyển Olympic Tin học.",
      "image": {
        "src": "/project/olympic-humg.webp",
        "alt": "Olympic HUMG — Nền Tảng Giáo Dục"
      },
      "images": [
        "/project/olympic-humg/olympic-humg_1.webp",
        "/project/olympic-humg/olympic-humg_2.webp"
      ],
      "techStack": [
        "Spring Boot",
        "React",
        "PostgreSQL",
        "Redis",
        "Flyway",
        "Docker",
        "Nginx",
        "OAuth2/JWT"
      ],
      "liveUrl": "https://olympic.humg.edu.vn",
      "sourceCode": "https://github.com/nghlong3004/humg-olympic-documentation",
      "details": [
        {
          "type": "paragraph",
          "text": "Nền tảng luyện tập cho sinh viên đại học chuẩn bị cho kỳ thi Olympic cấp Trường/Quốc gia, quản lý đội thi và lộ trình học tập."
        },
        {
          "type": "paragraph",
          "text": "Tính năng chính:"
        },
        {
          "type": "list",
          "items": [
            "Hệ thống đề thi thử với chấm điểm tự động",
            "Quản lý đội thi và thành viên",
            "Lộ trình học tập cá nhân hóa",
            "AI chatbot dựa trên RAG trả lời câu hỏi của sinh viên",
            "Xác thực Google OAuth2 + JWT",
            "Giám sát với Prometheus/Grafana + sao lưu PostgreSQL tự động"
          ]
        }
      ],
      "role": [
        {
          "type": "paragraph",
          "text": "Lập trình viên Full-stack:"
        },
        {
          "type": "list",
          "items": [
            "Tạo tài liệu kỹ thuật: C4 model, kiến trúc hệ thống, tài liệu REST API, sơ đồ ERD",
            "Thiết kế và triển khai Spring Boot REST APIs, PostgreSQL schema, và database migrations với Flyway",
            "Xây dựng lớp xác thực với Google OAuth2, JWT access/refresh tokens, và phân quyền dựa trên vai trò (RBAC)",
            "Tích hợp AI chatbot dựa trên RAG sử dụng LLM",
            "Triển khai Docker + Nginx reverse proxy, Prometheus/Grafana, và thiết lập lịch sao lưu tự động"
          ]
        }
      ]
    },
    {
      "id": "boom-online",
      "slug": "boom-online",
      "title": "Boom Online",
      "category": "Game Multiplayer Real-time",
      "year": "2025",
      "outcome": "Java Developer",
      "summary": "Game đặt bom multiplayer thời gian thực với Spring Boot WebSocket server, bot tìm đường bằng thuật toán A* và các design patterns Strategy/Observer/Factory.",
      "tagline": "Game Bomberman nhiều người chơi thời gian thực tích hợp bot AI A*.",
      "image": {
        "src": "/project/boom-online.webp",
        "alt": "Boom Online — Game Multiplayer Real-time"
      },
      "images": [
        "/project/boom-online/boom-1.webp",
        "/project/boom-online/boom-2.webp"
      ],
      "techStack": [
        "Spring Boot",
        "WebSocket",
        "Java Swing",
        "PostgreSQL",
        "Flyway",
        "A* Pathfinding"
      ],
      "sourceCode": "https://github.com/nghlong3004/boom-online",
      "details": [
        {
          "type": "paragraph",
          "text": "Game Bomberman nhiều người chơi trong thời gian thực tích hợp bot AI."
        },
        {
          "type": "paragraph",
          "text": "Tính năng chính:"
        },
        {
          "type": "list",
          "items": [
            "Đồng bộ hóa multiplayer thời gian thực qua WebSocket",
            "Bot AI sử dụng giải thuật tìm đường A* và xử lý va chạm",
            "Áp dụng các mẫu thiết kế: Strategy (độ khó bot), Observer (sự kiện game), Factory (tạo thực thể)",
            "Xác thực Google OAuth2 + JWT",
            "Quản lý database migrations với Flyway"
          ]
        }
      ],
      "role": [
        {
          "type": "paragraph",
          "text": "Lập trình viên Full-stack:"
        },
        {
          "type": "list",
          "items": [
            "Xây dựng Spring Boot backend với WebSocket cho đồng bộ multiplayer thời gian thực",
            "Triển khai giải thuật tìm đường A* cho chuyển động bot AI và thuật toán phát hiện va chạm",
            "Áp dụng các mẫu thiết kế Strategy, Observer, và Factory",
            "Tích hợp xác thực Google OAuth2 + JWT",
            "Quản lý database migrations với Flyway"
          ]
        }
      ]
    }
  ],
  "en": [
    {
      "id": "vinqa",
      "slug": "vinqa",
      "title": "VinQA",
      "category": "AI Quality Assessment",
      "year": "2026",
      "outcome": "Team Lead — Backend",
      "summary": "AI-assisted platform that scans URLs and generates actionable technical reports. Async Redis workers cut scan submission from ~30s to ~200ms.",
      "tagline": "Multi-service automated web quality testing platform with 9 scanning tools.",
      "image": {
        "src": "/project/vinqa/header.webp",
        "alt": "VinQA logo — automated UI testing and software quality assurance platform"
      },
      "images": [
        "/project/vinqa/vinqa_1.webp",
        "/project/vinqa/vinqa_2.webp"
      ],
      "techStack": [
        "Spring Boot",
        "React",
        "PostgreSQL",
        "Redis",
        "Docker",
        "Python",
        "Playwright",
        "Lighthouse"
      ],
      "liveUrl": "https://a20-app-054.nghlong3004.me/",
      "sourceCode": "https://github.com/nghlong3004/vinqa",
      "details": [
        {
          "type": "paragraph",
          "text": "Multi-service automated web quality testing platform. Users input a URL and receive a consolidated QA report with AI-driven scores and suggestions."
        },
        {
          "type": "paragraph",
          "text": "Key Features:"
        },
        {
          "type": "list",
          "items": [
            "Multi-service architecture: Spring Boot API + Python Worker + React SPA + PostgreSQL + Redis",
            "9 scanners: Accessibility, Performance, Security, SEO, Visual Regression, Content, Console, Functional/UX, Link Checker",
            "Asynchronous processing via Redis Queue (LPUSH/BLPOP)",
            "AES-GCM encryption for sensitive payloads + SSRF protection",
            "Real-time progress streaming via SSE",
            "LLM integration for issue explanations and remediation suggestions",
            "Monitoring with Prometheus/Grafana"
          ]
        }
      ],
      "role": [
        {
          "type": "paragraph",
          "text": "Backend / Full-stack / System Architecture:"
        },
        {
          "type": "list",
          "items": [
            "Designed and implemented the Spring Boot API layer: scan job lifecycle, Redis queue producer, PostgreSQL persistence, JWT/OAuth2 authentication, SSE progress streaming",
            "Built queue-based architecture with Redis LPUSH/BLPOP, separating the API from Python workers",
            "Implemented AES-GCM encryption for sensitive queue payloads and SSRF protection for target URLs",
            "Integrated PostgreSQL, Flyway, Redis, Docker Compose, Nginx, Prometheus, Grafana",
            "Developed React + TypeScript dashboard with scan submission, real-time progress, and report visualization"
          ]
        }
      ]
    },
    {
      "id": "vsf-qc-copilot",
      "slug": "vsf-qc-copilot",
      "title": "VSF QC Copilot",
      "category": "AI Evaluation Platform",
      "year": "2026",
      "outcome": "Built at Vinsmart Future",
      "summary": "An evaluation platform where QC teams configure chatbot/API targets, run AI-assisted evaluations and export results — Spring Boot, Redis workers, Promptfoo.",
      "tagline": "Internal automated testing and structured evaluation platform for chatbot APIs.",
      "image": {
        "src": "/project/VSF.webp",
        "alt": "VSF QC Copilot — AI Evaluation Platform"
      },
      "images": [
        "/project/VSF.webp"
      ],
      "techStack": [
        "Spring Boot",
        "Node.js",
        "Promptfoo",
        "React",
        "Vite",
        "TypeScript",
        "Redis Streams",
        "PostgreSQL",
        "Docker Compose"
      ],
      "sourceCode": "https://github.com/VSF-QC-TTS/vf-qc-copilot",
      "details": [
        {
          "type": "paragraph",
          "text": "Internal test automation platform designed for QC teams to automatically test and evaluate chatbot responses through APIs. The platform eliminates manual Excel workflows and blunt all-in-one LLM judges, shifting toward structured evaluation across specific fields, components, tools, and evaluation rubrics."
        },
        {
          "type": "paragraph",
          "text": "System Architecture (Microservices Monorepo):"
        },
        {
          "type": "list",
          "items": [
            "Frontend SPA (apps/client): React, Vite, TypeScript — QC dashboard to manage test projects, configure target APIs, generate AI test cases, and inspect evaluation reports.",
            "Backend API (apps/api): Java Spring Boot — core API services, business logic, evaluation lifecycle orchestration, LLM integration, and Redis Streams job producer.",
            "Evaluation Runner (apps/runner): Node.js — worker consumer that pulls jobs from Redis, queries chatbot APIs, normalizes responses, executes promptfoo assertions, and reports results back to Backend API.",
            "Data Infrastructure: PostgreSQL for persistent state, Redis Streams for distributed evaluation task queue."
          ]
        },
        {
          "type": "paragraph",
          "text": "Key Engineering Highlights:"
        },
        {
          "type": "list",
          "items": [
            "Automated multi-scenario testing with tiered assertions (regex, semantic similarity, LLM rubric judges)",
            "Comprehensive architectural documentation: C4 Model, LLD, Architecture Decision Records (ADRs)",
            "One-command local development environment with Docker Compose"
          ]
        }
      ],
      "role": [
        {
          "type": "paragraph",
          "text": "Backend Development & System Integration at Vinsmart Future:"
        },
        {
          "type": "list",
          "items": [
            "Designed and built Spring Boot Backend API managing test projects, evaluation suites, target APIs, and run lifecycles.",
            "Engineered distributed asynchronous queue pipeline using Redis Streams to dispatch eval jobs to the Node.js Runner.",
            "Architected PostgreSQL database schema for test cases, rubrics, and detailed execution metrics.",
            "Authored technical documentation: C4 Model Architecture, LLD, ADRs, and complete handover specs."
          ]
        }
      ]
    },
    {
      "id": "olympic-humg",
      "slug": "olympic-humg",
      "title": "Olympic HUMG",
      "category": "Education Platform",
      "year": "2025",
      "outcome": "Full-stack Developer",
      "summary": "Practice platform for Olympiad mock exams, team management and study roadmaps — with Google OAuth2, RBAC and a RAG-based chatbot.",
      "tagline": "Online training and management platform for University Informatics Olympiad teams.",
      "image": {
        "src": "/project/olympic-humg.webp",
        "alt": "Olympic HUMG — Education Platform"
      },
      "images": [
        "/project/olympic-humg/olympic-humg_1.webp",
        "/project/olympic-humg/olympic-humg_2.webp"
      ],
      "techStack": [
        "Spring Boot",
        "React",
        "PostgreSQL",
        "Redis",
        "Flyway",
        "Docker",
        "Nginx",
        "OAuth2/JWT"
      ],
      "liveUrl": "https://olympic.humg.edu.vn",
      "sourceCode": "https://github.com/nghlong3004/humg-olympic-documentation",
      "details": [
        {
          "type": "paragraph",
          "text": "Training platform for college students preparing for School/National Olympiads, managing teams, and learning pathways."
        },
        {
          "type": "paragraph",
          "text": "Key Features:"
        },
        {
          "type": "list",
          "items": [
            "Mock exam system with auto-grading",
            "Team and member management",
            "Personalized learning pathways",
            "RAG-based AI chatbot to answer student queries",
            "Google OAuth2 + JWT authentication",
            "Prometheus/Grafana monitoring + automatic PostgreSQL backups"
          ]
        }
      ],
      "role": [
        {
          "type": "paragraph",
          "text": "Full-stack Developer:"
        },
        {
          "type": "list",
          "items": [
            "Created technical documentation: C4 model, system architecture, REST API specs, and ERD",
            "Designed and implemented Spring Boot REST APIs, PostgreSQL schema, and Flyway migrations",
            "Built authentication using Google OAuth2, JWT access/refresh tokens, and Role-Based Access Control (RBAC)",
            "Integrated RAG-based AI chatbot with LLMs",
            "Deployed using Docker + Nginx reverse proxy, Prometheus/Grafana, and automated backup schedules"
          ]
        }
      ]
    },
    {
      "id": "boom-online",
      "slug": "boom-online",
      "title": "Boom Online",
      "category": "Real-time Multiplayer Game",
      "year": "2025",
      "outcome": "Java Developer",
      "summary": "Real-time multiplayer Bomberman-style game with a Spring Boot WebSocket server, A* pathfinding bots, and Strategy/Observer/Factory design patterns.",
      "tagline": "Real-time multiplayer Bomberman game with intelligent A* pathfinding bots.",
      "image": {
        "src": "/project/boom-online.webp",
        "alt": "Boom Online — Real-time Multiplayer Game"
      },
      "images": [
        "/project/boom-online/boom-1.webp",
        "/project/boom-online/boom-2.webp"
      ],
      "techStack": [
        "Spring Boot",
        "WebSocket",
        "Java Swing",
        "PostgreSQL",
        "Flyway",
        "A* Pathfinding"
      ],
      "sourceCode": "https://github.com/nghlong3004/boom-online",
      "details": [
        {
          "type": "paragraph",
          "text": "Real-time multiplayer Bomberman game integrated with AI bots."
        },
        {
          "type": "paragraph",
          "text": "Key Features:"
        },
        {
          "type": "list",
          "items": [
            "Real-time multiplayer synchronization via WebSockets",
            "AI bot with A* pathfinding and collision detection",
            "Design patterns: Strategy (bot difficulty), Observer (game events), Factory (entity creation)",
            "Google OAuth2 + JWT authentication",
            "Database migrations with Flyway"
          ]
        }
      ],
      "role": [
        {
          "type": "paragraph",
          "text": "Full-stack Developer:"
        },
        {
          "type": "list",
          "items": [
            "Built Spring Boot backend with WebSockets for real-time multiplayer synchronization",
            "Implemented A* pathfinding for AI bot movement and custom collision detection",
            "Applied Strategy, Observer, Factory design patterns",
            "Integrated Google OAuth2 + JWT authentication",
            "Managed database migrations using Flyway"
          ]
        }
      ]
    }
  ]
}

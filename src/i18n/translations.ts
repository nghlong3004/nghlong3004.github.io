import type { Language, TranslationDictionary } from "./types";

const ASSET_BASE =
  "https://api.getlayers.ai/storage/v1/object/public/public/assets/marcus-vane-6799bd1fb6";

export const translations: Record<Language, TranslationDictionary> = {
  en: {
    nav: {
      story: "Story",
      experience: "Experience",
      projects: "Projects",
      impact: "Impact",
      honors: "Honors",
      contact: "Contact",
    },

    hero: {
      roles: ["Developer", "Backend", "Automation", "Builder"],
    },

    marquee: [
      "Build Reliable",
      "Scale Relentlessly",
      "Automate Everything",
      "Measure What Matters",
      "Ship With Confidence",
    ],

    story: {
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
      ],
    },

    experience: {
      eyebrow: "Experience",
      heading: "Where the work happens.",
      currentLabel: "Active Role",

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
      ],
    },

    projects: {
      eyebrow: "Selected Projects",
      heading: "The work that shipped.",
      counter: "04 / Projects",
      detail: {
        back: "Back",
        year: "Year",
        tech: "Tech Stack",
        description: "Description",
        role: "My Role",
        visit_website: "Visit Website",
        view_code: "View GitHub",
      },

      projects: [
        {
          id: "vinqa",
          slug: "vinqa",
          name: "VinQA",
          title: "VinQA",
          category: "AI Quality Assessment",
          year: "2026",
          outcome: "Team Lead — Backend",
          blurb:
            "AI-assisted platform that scans URLs and generates actionable technical reports. Async Redis workers cut scan submission from ~30s to ~200ms.",
          image: "/project/vinqa.webp",
          liveUrl: "https://a20-app-054.nghlong3004.me/",
          sourceCode: "https://github.com/nghlong3004/vinqa",
          techStack: [
            "Spring Boot",
            "React",
            "PostgreSQL",
            "Redis",
            "Docker",
            "Python",
            "Playwright",
            "Lighthouse",
          ],
          images: [
            "/project/vinqa/vinqa_1.webp",
            "/project/vinqa/vinqa_2.webp",
          ],
          tagline: "Multi-service automated web quality testing platform with 9 scanning tools.",
          description:
            "Multi-service automated web quality testing platform. Users input a URL and receive a consolidated QA report with AI-driven scores and suggestions.<br/><br/>Key Features:<br/><ul><li>Multi-service architecture: Spring Boot API + Python Worker + React SPA + PostgreSQL + Redis</li><li>9 scanners: Accessibility, Performance, Security, SEO, Visual Regression, Content, Console, Functional/UX, Link Checker</li><li>Asynchronous processing via Redis Queue (LPUSH/BLPOP)</li><li>AES-GCM encryption for sensitive payloads + SSRF protection</li><li>Real-time progress streaming via SSE</li><li>LLM integration for issue explanations and remediation suggestions</li><li>Monitoring with Prometheus/Grafana</li></ul>",
          role:
            "Backend / Full-stack / System Architecture:<br/><ul><li>Designed and implemented the Spring Boot API layer: scan job lifecycle, Redis queue producer, PostgreSQL persistence, JWT/OAuth2 authentication, SSE progress streaming</li><li>Built queue-based architecture with Redis LPUSH/BLPOP, separating the API from Python workers</li><li>Implemented AES-GCM encryption for sensitive queue payloads and SSRF protection for target URLs</li><li>Integrated PostgreSQL, Flyway, Redis, Docker Compose, Nginx, Prometheus, Grafana</li><li>Developed React + TypeScript dashboard with scan submission, real-time progress, and report visualization</li></ul>",
        },

        {
          id: "vsf-qc-copilot",
          slug: "vsf-qc-copilot",
          name: "VSF QC Copilot",
          title: "VSF QC Copilot",
          category: "AI Evaluation Platform",
          year: "2026",
          outcome: "Built at Vinsmart Future",
          blurb:
            "An evaluation platform where QC teams configure chatbot/API targets, run AI-assisted evaluations and export results — Spring Boot, Redis workers, Promptfoo.",
          image: "/project/VSF.webp",
          sourceCode: "https://github.com/VSF-QC-TTS/vf-qc-copilot",
          techStack: [
            "Spring Boot",
            "Node.js",
            "Promptfoo",
            "React",
            "Vite",
            "TypeScript",
            "Redis Streams",
            "PostgreSQL",
            "Docker Compose",
          ],
          images: [
            "/project/VSF.webp",
          ],
          tagline: "Internal automated testing and structured evaluation platform for chatbot APIs.",
          description:
            "Internal test automation platform designed for QC teams to automatically test and evaluate chatbot responses through APIs. The platform eliminates manual Excel workflows and blunt all-in-one LLM judges, shifting toward structured evaluation across specific fields, components, tools, and evaluation rubrics.<br/><br/>System Architecture (Microservices Monorepo):<br/><ul><li><strong>Frontend SPA (apps/client):</strong> React, Vite, TypeScript — QC dashboard to manage test projects, configure target APIs, generate AI test cases, and inspect evaluation reports.</li><li><strong>Backend API (apps/api):</strong> Java Spring Boot — core API services, business logic, evaluation lifecycle orchestration, LLM integration, and Redis Streams job producer.</li><li><strong>Evaluation Runner (apps/runner):</strong> Node.js — worker consumer that pulls jobs from Redis, queries chatbot APIs, normalizes responses, executes promptfoo assertions, and reports results back to Backend API.</li><li><strong>Data Infrastructure:</strong> PostgreSQL for persistent state, Redis Streams for distributed evaluation task queue.</li></ul><br/>Key Engineering Highlights:<br/><ul><li>Automated multi-scenario testing with tiered assertions (regex, semantic similarity, LLM rubric judges)</li><li>Comprehensive architectural documentation: C4 Model, LLD, Architecture Decision Records (ADRs)</li><li>One-command local development environment with Docker Compose</li></ul>",
          role:
            "Backend Development & System Integration at Vinsmart Future:<br/><ul><li>Designed and built Spring Boot Backend API managing test projects, evaluation suites, target APIs, and run lifecycles.</li><li>Engineered distributed asynchronous queue pipeline using Redis Streams to dispatch eval jobs to the Node.js Runner.</li><li>Architected PostgreSQL database schema for test cases, rubrics, and detailed execution metrics.</li><li>Authored technical documentation: C4 Model Architecture, LLD, ADRs, and complete handover specs.</li></ul>",
        },

        {
          id: "olympic-humg",
          slug: "olympic-humg",
          name: "Olympic HUMG",
          title: "Olympic HUMG",
          category: "Education Platform",
          year: "2025",
          outcome: "Full-stack Developer",
          blurb:
            "Practice platform for Olympiad mock exams, team management and study roadmaps — with Google OAuth2, RBAC and a RAG-based chatbot.",
          image: "/project/olympic-humg.webp",
          liveUrl: "https://olympic.humg.edu.vn",
          sourceCode: "https://github.com/nghlong3004/humg-olympic-documentation",
          techStack: [
            "Spring Boot",
            "React",
            "PostgreSQL",
            "Redis",
            "Flyway",
            "Docker",
            "Nginx",
            "OAuth2/JWT",
          ],
          images: [
            "/project/olympic-humg/olympic-humg_1.webp",
            "/project/olympic-humg/olympic-humg_2.webp",
          ],
          tagline: "Online training and management platform for University Informatics Olympiad teams.",
          description:
            "Training platform for college students preparing for School/National Olympiads, managing teams, and learning pathways.<br/><br/>Key Features:<br/><ul><li>Mock exam system with auto-grading</li><li>Team and member management</li><li>Personalized learning pathways</li><li>RAG-based AI chatbot to answer student queries</li><li>Google OAuth2 + JWT authentication</li><li>Prometheus/Grafana monitoring + automatic PostgreSQL backups</li></ul>",
          role:
            "Full-stack Developer:<br/><ul><li>Created technical documentation: C4 model, system architecture, REST API specs, and ERD</li><li>Designed and implemented Spring Boot REST APIs, PostgreSQL schema, and Flyway migrations</li><li>Built authentication using Google OAuth2, JWT access/refresh tokens, and Role-Based Access Control (RBAC)</li><li>Integrated RAG-based AI chatbot with LLMs</li><li>Deployed using Docker + Nginx reverse proxy, Prometheus/Grafana, and automated backup schedules</li></ul>",
        },

        {
          id: "boom-online",
          slug: "boom-online",
          name: "Boom Online",
          title: "Boom Online",
          category: "Real-time Multiplayer Game",
          year: "2025",
          outcome: "Java Developer",
          blurb:
            "Real-time multiplayer Bomberman-style game with a Spring Boot WebSocket server, A* pathfinding bots, and Strategy/Observer/Factory design patterns.",
          image: "/project/boom-online.webp",
          sourceCode: "https://github.com/nghlong3004/boom-online",
          techStack: [
            "Spring Boot",
            "WebSocket",
            "Java Swing",
            "PostgreSQL",
            "Flyway",
            "A* Pathfinding",
          ],
          images: [
            "/project/boom-online/boom-1.webp",
            "/project/boom-online/boom-2.webp",
          ],
          tagline: "Real-time multiplayer Bomberman game with intelligent A* pathfinding bots.",
          description:
            "Real-time multiplayer Bomberman game integrated with AI bots.<br/><br/>Key Features:<br/><ul><li>Real-time multiplayer synchronization via WebSockets</li><li>AI bot with A* pathfinding and collision detection</li><li>Design patterns: Strategy (bot difficulty), Observer (game events), Factory (entity creation)</li><li>Google OAuth2 + JWT authentication</li><li>Database migrations with Flyway</li></ul>",
          role:
            "Full-stack Developer:<br/><ul><li>Built Spring Boot backend with WebSockets for real-time multiplayer synchronization</li><li>Implemented A* pathfinding for AI bot movement and custom collision detection</li><li>Applied Strategy, Observer, Factory design patterns</li><li>Integrated Google OAuth2 + JWT authentication</li><li>Managed database migrations using Flyway</li></ul>",
        },
      ],
    },

    impact: {
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
      ],
    },

    honors: {
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
      ],
    },

    contact: {
      eyebrow: "Let's Build",
      heading: "Have a hard problem that needs solving?",
      intro: "That's usually where I start. I read every message I'm sent.",
      footerTagline: "Designed & built with conviction.",
      copyright: "© 2026 Nguyen Hoang Long. All rights reserved.",
      stayConnected: "Stay Connected",
      newsletterDesc:
        "Join my newsletter for the latest updates on backend engineering, system architecture, and tech experiments.",
      quickLinks: "Quick Navigation",
      contactUs: "Direct Contact",
      followUs: "Follow & Connect",
      emailPlaceholder: "Enter your email",
      subscribeSuccess: "Subscribed! Thank you for connecting.",
      location: "Hanoi, Vietnam",
    },
  },

  vi: {
    nav: {
      story: "Câu chuyện",
      experience: "Kinh nghiệm",
      projects: "Dự án",
      impact: "Thống kê",
      honors: "Giải thưởng",
      contact: "Liên hệ",
    },

    hero: {
      roles: ["Developer", "Backend", "Automation", "Builder"],
    },

    marquee: [
      "Xây Dựng Bền Vững",
      "Mở Rộng Không Ngừng",
      "Tự Động Hóa Mọi Thứ",
      "Đo Lường Điều Quan Trọng",
      "Tự Tin Đưa Sản Phẩm Vào Thực Tế",
    ],

    story: {
      eyebrow: "Câu chuyện",
      heading: "Reliable systems are never an accident.",
      intro:
        "Mình là sinh viên kỹ thuật năm cuối, bắt đầu từ niềm yêu thích thuật toán và dần đưa nó vào những sản phẩm backend thực tế. Từ game multiplayer thời gian thực với bot A* đến nền tảng QC ứng dụng AI — và hiện tại là Automation Test tại VinFast — cách mình tiếp cận vấn đề vẫn luôn nhất quán: chọn bài toán khó, thiết kế cho đúng và đo lường xem giải pháp có thực sự tốt hơn hay không.",

      principles: [
        {
          index: "01",
          title: "Thiết kế để sẵn sàng mở rộng",
          body: "Các tác vụ nặng nên được đưa vào queue thay vì giữ request thread phải chờ. Mình đã đưa thời gian submit một scan từ ~30s xuống ~200ms bằng workflow async với Redis.",
        },
        {
          index: "02",
          title: "Tự động hóa những việc lặp lại",
          body: "Manual testing không thể scale mãi. Mình xây dựng framework kiểm thử có thể tái sử dụng, để mỗi tool mới chỉ cần tập trung vào core logic — đồng thời có UI để sử dụng thay vì chỉ phụ thuộc vào CLI.",
        },
        {
          index: "03",
          title: "Bảo mật phải có ngay từ thiết kế",
          body: "OAuth2/JWT, owner-scoped APIs, mã hóa secret keys, SSRF protection và rate limiting — đều được tính đến ngay từ đầu thay vì bổ sung sau khi hệ thống đã hoàn thiện.",
        },
        {
          index: "04",
          title: "Đo lường mọi thứ",
          body: "Nếu chưa theo dõi được thì chưa thể coi là hoàn thiện. Mình sử dụng Prometheus, Grafana và Langfuse tracing — đồng thời giảm chi phí LLM-as-a-Judge từ ~$1,200 xuống ~$500.",
        },
      ],
    },

    experience: {
      eyebrow: "Kinh nghiệm",
      heading: "Where the work happens.",
      currentLabel: "Đang làm việc",

      roles: [
        {
          company: "VinFast",
          role: "Junior Automation Test",
          period: "07/2026 – Nay",
          current: true,
          initials: "VF",
          logo: "/company/VinFast.png",
          logoDark: "/company/VinFast-dark.png",
          tech: ["Java", "Python", "Playwright", "CI/CD", "Langfuse"],

          highlights: [
            "Xây dựng automation cho research chatbot, knowledge base, ASR/TTS và API E2E scripts.",
            "Xây dựng và duy trì CI/CD pipelines với GitLab.",
            "Giảm chi phí LLM-as-a-Judge từ ~$1,200 xuống ~$500.",
            "Thiết kế framework kiểm thử có thể tái sử dụng — tool mới chỉ cần tập trung vào core logic, đồng thời có UI thay vì phải thao tác hoàn toàn qua CLI.",
          ],
        },

        {
          company: "Vinsmart Future",
          role: "Thực tập sinh",
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
            "Chuyển các quy trình QC thực tế thành tính năng trên platform và tài liệu C4 architecture.",
            "Xây dựng các tính năng Spring Boot cho projects, target API connectors, datasets, rubrics và evaluation runs.",
            "Triển khai quy trình evaluation bất đồng bộ bằng Redis workers và Promptfoo execution.",
            "Xây dựng luồng xác thực OAuth2/JWT, owner-scoped APIs và cơ chế mã hóa API keys.",
          ],
        },
      ],
    },

    projects: {
      eyebrow: "Dự án tiêu biểu",
      heading: "The work that shipped.",
      counter: "04 / Dự án",
      detail: {
        back: "Quay lại",
        year: "Năm",
        tech: "Tech Stack",
        description: "Mô tả",
        role: "Vai trò của mình",
        visit_website: "Ghé thăm trang web",
        view_code: "Xem GitHub",
      },

      projects: [
        {
          id: "vinqa",
          slug: "vinqa",
          name: "VinQA",
          title: "VinQA",
          category: "Đánh Giá Chất Lượng AI",
          year: "2026",
          outcome: "Team Lead — Backend",
          blurb:
            "Nền tảng ứng dụng AI để scan URL và tạo báo cáo kỹ thuật. Async Redis workers giúp giảm thời gian submit scan từ ~30s xuống ~200ms.",
          image: "/project/vinqa.webp",
          liveUrl: "https://a20-app-054.nghlong3004.me/",
          sourceCode: "https://github.com/nghlong3004/vinqa",
          techStack: [
            "Spring Boot",
            "React",
            "PostgreSQL",
            "Redis",
            "Docker",
            "Python",
            "Playwright",
            "Lighthouse",
          ],
          images: [
            "/project/vinqa/vinqa_1.webp",
            "/project/vinqa/vinqa_2.webp",
          ],
          tagline: "Nền tảng kiểm thử chất lượng web tự động đa dịch vụ với 9 công cụ quét.",
          description:
            "Nền tảng kiểm thử chất lượng web tự động đa dịch vụ. Người dùng nhập URL, hệ thống trả về báo cáo QA tổng hợp với điểm số và gợi ý sửa lỗi AI.<br/><br/>Tính năng chính:<br/><ul><li>Kiến trúc đa dịch vụ: Spring Boot API + Python Worker + React SPA + PostgreSQL + Redis</li><li>9 công cụ scan: Accessibility, Performance, Security, SEO, Visual Regression, Content, Console, Functional/UX, Link Checker</li><li>Xử lý bất đồng bộ qua Redis Queue (LPUSH/BLPOP)</li><li>Mã hóa AES-GCM cho payload nhạy cảm + bảo vệ chống tấn công SSRF</li><li>SSE streaming tiến trình thời gian thực</li><li>Tích hợp LLM để giải thích lỗi và gợi ý sửa đổi</li><li>Giám sát hệ thống với Prometheus và Grafana</li></ul>",
          role:
            "Backend / Full-stack / Kiến trúc hệ thống:<br/><ul><li>Thiết kế và triển khai lớp Spring Boot API: vòng đời quét lỗi, Redis queue producer, lưu trữ PostgreSQL, xác thực JWT/OAuth2, SSE progress streaming</li><li>Xây dựng kiến trúc hàng đợi Redis LPUSH/BLPOP, tách biệt API với Python worker</li><li>Triển khai mã hóa AES-GCM cho gói tin nhạy cảm và bảo vệ chống tấn công SSRF cho các URL đích</li><li>Tích hợp PostgreSQL, Flyway, Redis, Docker Compose, Nginx, Prometheus, Grafana</li><li>Phát triển dashboard React + TypeScript phục vụ gửi yêu cầu quét, theo dõi tiến trình trực tiếp, hiển thị báo cáo trực quan</li></ul>",
        },

        {
          id: "vsf-qc-copilot",
          slug: "vsf-qc-copilot",
          name: "VSF QC Copilot",
          title: "VSF QC Copilot",
          category: "Nền Tảng Đánh Giá AI",
          year: "2026",
          outcome: "Phát triển tại Vinsmart Future",
          blurb:
            "Nền tảng evaluation cho phép đội ngũ QC cấu hình chatbot/API targets, chạy đánh giá với AI và export kết quả — sử dụng Spring Boot, Redis workers và Promptfoo.",
          image: "/project/VSF.webp",
          sourceCode: "https://github.com/VSF-QC-TTS/vf-qc-copilot",
          techStack: [
            "Spring Boot",
            "Node.js",
            "Promptfoo",
            "React",
            "Vite",
            "TypeScript",
            "Redis Streams",
            "PostgreSQL",
            "Docker Compose",
          ],
          images: [
            "/project/VSF.webp",
          ],
          tagline: "Nền tảng tự động hóa kiểm thử nội bộ đánh giá phản hồi chatbot theo tiêu chí có cấu trúc.",
          description:
            "Dự án này là nền tảng tự động hóa kiểm thử nội bộ dành cho đội ngũ QC, được thiết kế để kiểm thử và đánh giá tự động các phản hồi của chatbot thông qua API. Hệ thống sinh ra để giảm bớt quy trình thủ công sử dụng Excel và các công cụ đánh giá tổng hợp bằng AI (all-in-one LLM judge), chuyển hướng sang phương pháp <strong>đánh giá có cấu trúc (structured evaluation)</strong> dựa trên từng trường, thành phần, công cụ và tiêu chí đánh giá (rubric) cụ thể.<br/><br/><strong>Kiến Trúc Hệ Thống (Microservices Monorepo):</strong><br/><ul><li><strong>Frontend SPA (apps/client):</strong> React, Vite, TypeScript — giao diện cho đội ngũ QC để quản lý dự án, cấu hình mục tiêu kiểm thử, tạo dữ liệu kiểm thử (test cases) bằng AI, và đánh giá kết quả chạy kiểm thử (run reports).</li><li><strong>Backend API (apps/api):</strong> Java Spring Boot — cung cấp API lõi, quản lý logic nghiệp vụ, quản lý vòng đời đánh giá, phối hợp với các LLM, và đẩy các tác vụ kiểm thử (jobs) vào hàng đợi Redis Streams.</li><li><strong>Evaluation Runner (apps/runner):</strong> Node.js — consumer nhận task từ Redis, gọi API chatbot, chuẩn hóa response, chạy assertions/evaluations bằng promptfoo và trả kết quả về Backend API.</li><li><strong>Hạ tầng dữ liệu:</strong> PostgreSQL lưu trữ dữ liệu nghiệp vụ, Redis Streams làm hàng đợi cho runner.</li></ul><br/><strong>Điểm nổi bật kỹ thuật:</strong><br/><ul><li>Chạy kiểm thử tự động nhiều kịch bản, assertion đa tầng (regex, semantic similarity, LLM rubric judge)</li><li>Tài liệu thiết kế kiến trúc chuẩn C4 Model, LLD, ADRs và API specs chi tiết</li><li>Hỗ trợ khởi tạo toàn bộ hạ tầng cục bộ (local) với Docker Compose</li></ul>",
          role:
            "Backend Development & Tích hợp hệ thống tại Vinsmart Future:<br/><ul><li>Thiết kế và xây dựng Spring Boot Backend API quản lý dự án kiểm thử, cấu hình test suites, target APIs và vòng đời evaluation runs.</li><li>Xây dựng kiến trúc message queue với Redis Streams để phân phối tác vụ kiểm thử bất đồng bộ cho Node.js Runner.</li><li>Thiết kế cơ sở dữ liệu PostgreSQL và quản lý dữ liệu test cases, rubrics, metrics kết quả.</li><li>Soạn thảo tài liệu kỹ thuật hoàn chỉnh: C4 Model Architecture, LLD, ADRs và tài liệu bàn giao sản phẩm.</li></ul>",
        },

        {
          id: "olympic-humg",
          slug: "olympic-humg",
          name: "Olympic HUMG",
          title: "Olympic HUMG",
          category: "Nền Tảng Giáo Dục",
          year: "2025",
          outcome: "Full-stack Developer",
          blurb:
            "Nền tảng luyện thi Olympic, quản lý đội tuyển và xây dựng lộ trình học tập — tích hợp Google OAuth2, RBAC và chatbot sử dụng RAG.",
          image: "/project/olympic-humg.webp",
          liveUrl: "https://olympic.humg.edu.vn",
          sourceCode: "https://github.com/nghlong3004/humg-olympic-documentation",
          techStack: [
            "Spring Boot",
            "React",
            "PostgreSQL",
            "Redis",
            "Flyway",
            "Docker",
            "Nginx",
            "OAuth2/JWT",
          ],
          images: [
            "/project/olympic-humg/olympic-humg_1.webp",
            "/project/olympic-humg/olympic-humg_2.webp",
          ],
          tagline: "Nền tảng luyện tập trực tuyến và quản lý đội tuyển Olympic Tin học.",
          description:
            "Nền tảng luyện tập cho sinh viên đại học chuẩn bị cho kỳ thi Olympic cấp Trường/Quốc gia, quản lý đội thi và lộ trình học tập.<br/><br/>Tính năng chính:<br/><ul><li>Hệ thống đề thi thử với chấm điểm tự động</li><li>Quản lý đội thi và thành viên</li><li>Lộ trình học tập cá nhân hóa</li><li>AI chatbot dựa trên RAG trả lời câu hỏi của sinh viên</li><li>Xác thực Google OAuth2 + JWT</li><li>Giám sát với Prometheus/Grafana + sao lưu PostgreSQL tự động</li></ul>",
          role:
            "Lập trình viên Full-stack:<br/><ul><li>Tạo tài liệu kỹ thuật: C4 model, kiến trúc hệ thống, tài liệu REST API, sơ đồ ERD</li><li>Thiết kế và triển khai Spring Boot REST APIs, PostgreSQL schema, và database migrations với Flyway</li><li>Xây dựng lớp xác thực với Google OAuth2, JWT access/refresh tokens, và phân quyền dựa trên vai trò (RBAC)</li><li>Tích hợp AI chatbot dựa trên RAG sử dụng LLM</li><li>Triển khai Docker + Nginx reverse proxy, Prometheus/Grafana, và thiết lập lịch sao lưu tự động</li></ul>",
        },

        {
          id: "boom-online",
          slug: "boom-online",
          name: "Boom Online",
          title: "Boom Online",
          category: "Game Multiplayer Real-time",
          year: "2025",
          outcome: "Java Developer",
          blurb:
            "Game đặt bom multiplayer thời gian thực với Spring Boot WebSocket server, bot tìm đường bằng thuật toán A* và các design patterns Strategy/Observer/Factory.",
          image: "/project/boom-online.webp",
          sourceCode: "https://github.com/nghlong3004/boom-online",
          techStack: [
            "Spring Boot",
            "WebSocket",
            "Java Swing",
            "PostgreSQL",
            "Flyway",
            "A* Pathfinding",
          ],
          images: [
            "/project/boom-online/boom-1.webp",
            "/project/boom-online/boom-2.webp",
          ],
          tagline: "Game Bomberman nhiều người chơi thời gian thực tích hợp bot AI A*.",
          description:
            "Game Bomberman nhiều người chơi trong thời gian thực tích hợp bot AI.<br/><br/>Tính năng chính:<br/><ul><li>Đồng bộ hóa multiplayer thời gian thực qua WebSocket</li><li>Bot AI sử dụng giải thuật tìm đường A* và xử lý va chạm</li><li>Áp dụng các mẫu thiết kế: Strategy (độ khó bot), Observer (sự kiện game), Factory (tạo thực thể)</li><li>Xác thực Google OAuth2 + JWT</li><li>Quản lý database migrations với Flyway</li></ul>",
          role:
            "Lập trình viên Full-stack:<br/><ul><li>Xây dựng Spring Boot backend với WebSocket cho đồng bộ multiplayer thời gian thực</li><li>Triển khai giải thuật tìm đường A* cho chuyển động bot AI và thuật toán phát hiện va chạm</li><li>Áp dụng các mẫu thiết kế Strategy, Observer, và Factory</li><li>Tích hợp xác thực Google OAuth2 + JWT</li><li>Quản lý database migrations với Flyway</li></ul>",
        },
      ],
    },

    impact: {
      eyebrow: "Những con số",
      heading: "Results, measured.",

      stats: [
        {
          value: "4",
          label: "Dự án đã thiết kế & phát triển",
        },
        {
          value: "200ms",
          label: "Độ trễ khi submit scan, giảm từ ~30s",
        },
        {
          value: "58%",
          label: "Giảm chi phí LLM-as-a-Judge, từ ~$1,200 xuống ~$500",
        },
        {
          value: "6",
          label: "Giải thưởng cấp Quốc gia & Tỉnh",
        },
      ],
    },

    honors: {
      eyebrow: "Giải thưởng",
      heading: "Trained on hard problems.",

      items: [
        {
          id: "calculus",
          index: "01",
          text: "Giành Giải Ba môn Giải tích tại Kỳ thi Olympic Toán học Sinh viên Toàn quốc trong hai năm liên tiếp.",
          name: "Giải tích",
          role: "Olympic Toán học Toàn quốc · 2025, 2026",
          image: `${ASSET_BASE}/voices/voice-01.webp`,
        },

        {
          id: "linear-algebra",
          index: "02",
          text: "Ở môn Đại số tại Olympic Toán học Toàn quốc, mình đạt Giải Ba năm 2024 và Giải Khuyến khích năm 2025.",
          name: "Đại số tuyến tính",
          role: "Olympic Toán học Toàn quốc · 2024, 2025",
          image: `${ASSET_BASE}/voices/voice-02.webp`,
        },

        {
          id: "informatics",
          index: "03",
          text: "Đạt Giải Nhì lớp 12 năm 2023 và Giải Khuyến khích lớp 11 năm 2022 tại Kỳ thi Học sinh Giỏi Tin học cấp Tỉnh.",
          name: "Tin học",
          role: "Kỳ thi Học sinh Giỏi cấp Tỉnh · 2022, 2023",
          image: `${ASSET_BASE}/voices/voice-03.webp`,
        },
      ],
    },

    contact: {
      eyebrow: "Hợp tác",
      heading: "Bạn có bài toán khó cần giải quyết?",
      intro:
        "Đó thường là nơi mình thích bắt đầu. Mình đọc và phản hồi mọi tin nhắn nhận được.",
      footerTagline: "Thiết kế & xây dựng với sự chỉn chu.",
      copyright: "© 2026 Nguyễn Hoàng Long.",
      stayConnected: "Giữ Kết Nối",
      newsletterDesc:
        "Nhận những cập nhật mới về backend engineering, system architecture và các thử nghiệm công nghệ mình đang thực hiện.",
      quickLinks: "Điều Hướng Nhanh",
      contactUs: "Liên Hệ Trực Tiếp",
      followUs: "Theo Dõi & Kết Nối",
      emailPlaceholder: "Nhập email của bạn",
      subscribeSuccess: "Đăng ký thành công! Cảm ơn bạn đã kết nối.",
      location: "Hà Nội, Việt Nam",
    },
  },
};
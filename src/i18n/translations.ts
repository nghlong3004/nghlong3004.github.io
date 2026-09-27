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

      projects: [
        {
          id: "vinqa",
          name: "VinQA",
          category: "AI Quality Assessment",
          year: "2026",
          outcome: "Team Lead — Backend",
          blurb:
            "AI-assisted platform that scans URLs and generates actionable technical reports. Async Redis workers cut scan submission from ~30s to ~200ms.",
          image: "/project/vinqa.webp",
        },

        {
          id: "vsf-qc-copilot",
          name: "VSF QC Copilot",
          category: "AI Evaluation Platform",
          year: "2026",
          outcome: "Built at Vinsmart Future",
          blurb:
            "An evaluation platform where QC teams configure chatbot/API targets, run AI-assisted evaluations and export results — Spring Boot, Redis workers, Promptfoo.",
          image: "/project/VSF.webp",
        },

        {
          id: "olympic-humg",
          name: "Olympic HUMG",
          category: "Education Platform",
          year: "2025",
          outcome: "Full-stack Developer",
          blurb:
            "Practice platform for Olympiad mock exams, team management and study roadmaps — with Google OAuth2, RBAC and a RAG-based chatbot.",
          image: "/project/olympic-humg.webp",
        },

        {
          id: "boom-online",
          name: "Boom Online",
          category: "Real-time Multiplayer Game",
          year: "2025",
          outcome: "Java Developer",
          blurb:
            "Real-time multiplayer Bomberman-style game with a Spring Boot WebSocket server, A* pathfinding bots, and Strategy/Observer/Factory design patterns.",
          image: "/project/boom-online.webp",
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

      projects: [
        {
          id: "vinqa",
          name: "VinQA",
          category: "Đánh Giá Chất Lượng AI",
          year: "2026",
          outcome: "Team Lead — Backend",
          blurb:
            "Nền tảng ứng dụng AI để scan URL và tạo báo cáo kỹ thuật. Async Redis workers giúp giảm thời gian submit scan từ ~30s xuống ~200ms.",
          image: "/project/vinqa.webp",
        },

        {
          id: "vsf-qc-copilot",
          name: "VSF QC Copilot",
          category: "Nền Tảng Đánh Giá AI",
          year: "2026",
          outcome: "Phát triển tại Vinsmart Future",
          blurb:
            "Nền tảng evaluation cho phép đội ngũ QC cấu hình chatbot/API targets, chạy đánh giá với AI và export kết quả — sử dụng Spring Boot, Redis workers và Promptfoo.",
          image: "/project/VSF.webp",
        },

        {
          id: "olympic-humg",
          name: "Olympic HUMG",
          category: "Nền Tảng Giáo Dục",
          year: "2025",
          outcome: "Full-stack Developer",
          blurb:
            "Nền tảng luyện thi Olympic, quản lý đội tuyển và xây dựng lộ trình học tập — tích hợp Google OAuth2, RBAC và chatbot sử dụng RAG.",
          image: "/project/olympic-humg.webp",
        },

        {
          id: "boom-online",
          name: "Boom Online",
          category: "Game Multiplayer Real-time",
          year: "2025",
          outcome: "Java Developer",
          blurb:
            "Game đặt bom multiplayer thời gian thực với Spring Boot WebSocket server, bot tìm đường bằng thuật toán A* và các design patterns Strategy/Observer/Factory.",
          image: "/project/boom-online.webp",
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
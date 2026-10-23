import type { Language, PortfolioStory } from '../types'

export const stories: Record<Language, PortfolioStory> = {
  "vi": {
    "intro": "Xuất phát điểm từ những đêm chơi LOL thâu sáng, dần dà mình nhận ra điều mình thực sự mê là cảm giác ngồi trước chiếc máy tính: ngắm từng dòng pixel hiện lên khi gõ phím và đắm chìm vào giải quyết những bài toán khó. Từ tựa game multiplayer thời gian thực với bot A* đến nền tảng QC ứng dụng AI — và hiện tại là VinFast — hành trình ấy vẫn chỉ xoay quanh một điều: chọn bài toán khó, thiết kế cho đúng và tìm cách giải bằng được.",
    "principles": [
      {
        "title": "Thiết kế để sẵn sàng mở rộng",
        "body": "Các tác vụ nặng nên được đưa vào queue thay vì giữ request thread phải chờ. Mình đã đưa thời gian submit một scan từ ~30s xuống ~200ms bằng workflow async với Redis."
      },
      {
        "title": "Tự động hóa những việc lặp lại",
        "body": "Manual testing không thể scale mãi. Mình xây dựng framework kiểm thử có thể tái sử dụng, để mỗi tool mới chỉ cần tập trung vào core logic — đồng thời có UI để sử dụng thay vì chỉ phụ thuộc vào CLI."
      },
      {
        "title": "Bảo mật phải có ngay từ thiết kế",
        "body": "OAuth2/JWT, owner-scoped APIs, mã hóa secret keys, SSRF protection và rate limiting — đều được tính đến ngay từ đầu thay vì bổ sung sau khi hệ thống đã hoàn thiện."
      },
      {
        "title": "Đo lường mọi thứ",
        "body": "Nếu chưa theo dõi được thì chưa thể coi là hoàn thiện. Mình sử dụng Prometheus, Grafana và Langfuse tracing — đồng thời giảm chi phí LLM-as-a-Judge từ ~$1,200 xuống ~$500."
      }
    ]
  },
  "en": {
    "intro": "Starting from all-night League of Legends sessions, I gradually realized what I truly fell in love with: sitting in front of a computer, watching pixels light up with every keystroke, and losing myself in solving hard problems. From a real-time multiplayer game with A* bots to an AI-assisted QC platform — and now at VinFast — the through-line never changed: pick the hard problem, design it properly, and solve it to the end.",
    "principles": [
      {
        "title": "Design for scale from day one",
        "body": "Blocking work belongs in queues, not request threads. I turned a ~30s scan submission into a ~200ms async Redis workflow."
      },
      {
        "title": "Automate the repetitive",
        "body": "Manual checks don't scale. I build reusable test frameworks where new tools only need core logic — with a UI, not just a CLI."
      },
      {
        "title": "Security is a feature",
        "body": "OAuth2/JWT, owner-scoped APIs, encrypted keys, SSRF protection and rate limiting — designed in from the start, never bolted on."
      },
      {
        "title": "Measure everything",
        "body": "If it isn't monitored, it isn't done. Prometheus, Grafana and Langfuse tracing — and LLM-judge costs cut from ~$1,200 to ~$500."
      }
    ]
  }
}

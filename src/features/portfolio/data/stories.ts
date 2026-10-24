import type { Language, PortfolioStory } from '../types'

export const stories: Record<Language, PortfolioStory> = {
  "vi": {
    "intro": "Mình đến với lập trình từ sở thích chơi game và sự tò mò về cách phần mềm được tạo ra. Qua các dự án như Boom Online và Olympic HUMG, mình có dịp thử ý tưởng, sửa lỗi và học thêm từ những lần làm chưa tốt. Mình muốn ghi lại quá trình ấy qua từng dự án cụ thể.",
    "principles": [
      {
        "title": "Hiểu trước khi làm",
        "body": "Mình bắt đầu bằng việc làm rõ nhu cầu và giới hạn của dự án, rồi chọn cách triển khai vừa đủ."
      },
      {
        "title": "Làm từng bước nhỏ",
        "body": "Mình chia việc thành những phần có thể kiểm tra riêng, thử một cách đơn giản trước rồi điều chỉnh khi cần."
      },
      {
        "title": "Kiểm tra và ghi chép",
        "body": "Mình cố gắng kiểm tra các thay đổi và ghi lại cách chạy dự án để bản thân và người đọc có thể xem lại."
      },
      {
        "title": "Học từ phản hồi",
        "body": "Khi có góp ý hoặc gặp lỗi, mình xem lại cách làm và dùng những điều học được cho lần tiếp theo."
      }
    ]
  },
  "en": {
    "intro": "I came to programming through games and a curiosity about how software is made. Projects like Boom Online and Olympic HUMG gave me room to try ideas, fix mistakes and learn from what did not work. I want to share that process through the projects themselves.",
    "principles": [
      {
        "title": "Understand before building",
        "body": "I start by clarifying a project's needs and constraints, then choose an approach that fits."
      },
      {
        "title": "Take small steps",
        "body": "I break work into parts I can check independently, try a simple approach first and adjust when needed."
      },
      {
        "title": "Check and document",
        "body": "I aim to check changes and document how to run each project so I and others can revisit it."
      },
      {
        "title": "Learn from feedback",
        "body": "Feedback and bugs are a reason to revisit my approach and carry what I learn into the next project."
      }
    ]
  }
}

import type { Language, PortfolioProfile } from '../types'
import { portraits } from './portrait.ts'

export const profiles: Record<Language, PortfolioProfile> = {
  "vi": {
    "name": "Nguyễn Hoàng Long",
    "displayName": "HOANG LONG",
    "role": "Lập trình viên",
    "bio": "Từ sở thích chơi game, mình bắt đầu tìm hiểu cách phần mềm hoạt động rồi học lập trình. Portfolio này ghi lại các dự án và những điều mình đã học.",
    "intro": "Đang làm việc tại VinFast.",
    "location": "Hà Nội, Việt Nam",
    "email": "nghlong3004@gmail.com",
    portrait: portraits.vi
  },
  "en": {
    "name": "Nguyen Hoang Long",
    "displayName": "HOANG LONG",
    "role": "Software Developer",
    "bio": "An interest in games led me to explore how software works and learn to code. This portfolio brings together my projects and what I have learned along the way.",
    "intro": "Currently working at VinFast.",
    "location": "Hanoi, Vietnam",
    "email": "nghlong3004@gmail.com",
    portrait: portraits.en
  }
}

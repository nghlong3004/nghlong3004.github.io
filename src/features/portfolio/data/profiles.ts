import type { Language, PortfolioProfile } from '../types'
import { portraits } from './portrait.ts'

export const profiles: Record<Language, PortfolioProfile> = {
  "vi": {
    "name": "Nguyễn Hoàng Long",
    "displayName": "HOANG LONG",
    "role": "Lập trình viên · Backend · Automation",
    "bio": "Bắt đầu từ những đêm chơi game thâu sáng, mình nhận ra niềm mê mẩn với chiếc máy tính, từng dòng pixel khi gõ phím và cảm giác giải được một bài toán khó. Hiện đang làm việc tại VinFast.",
    "intro": "Mình xây dựng backend và tự động hóa những bài toán khó. Hiện tại VinFast.",
    "location": "Hà Nội, Việt Nam",
    "email": "nghlong3004@gmail.com",
    portrait: portraits.vi
  },
  "en": {
    "name": "Nguyen Hoang Long",
    "displayName": "HOANG LONG",
    "role": "Software Developer · Backend · Automation",
    "bio": "From late-night gaming sessions to an obsession with glowing pixels, typing code, and cracking hard problems. Currently at VinFast.",
    "intro": "I build backend systems and automate the hard parts. Currently at VinFast.",
    "location": "Hanoi, Vietnam",
    "email": "nghlong3004@gmail.com",
    portrait: portraits.en
  }
}

import type { Language, PortfolioLabels } from '../types'

export const labels: Record<Language, PortfolioLabels> = {
  vi: {
    intro: 'Giới thiệu', story: 'Chọn bài toán khó.', experience: 'Kinh nghiệm',
    projects: 'Dự án đã xây dựng', impact: 'Kết quả đo được', honors: 'Thành tích', contact: 'Liên hệ',
    open: 'Cuộn để mở', explore: 'Khám phá dự án', more: 'Xem thêm', less: 'Thu gọn',
    live: 'Xem trực tiếp', code: 'Mã nguồn', role: 'Vai trò của mình', current: 'Hiện tại',
    projectNotification: 'Scan · ~30 giây → ~200 ms',
    contactNotification: 'Kết nối với Long', coverHint: 'Chạm thông báo để khám phá',
    contactHeading: 'Bắt đầu một cuộc trò chuyện.',
    contactIntro: 'Về backend, automation hay một bài toán thú vị — kết nối với mình qua email.',
    gallery: 'Hình ảnh dự án', language: 'Ngôn ngữ',
  },
  en: {
    intro: 'About', story: 'Pick the hard problem.', experience: 'Experience',
    projects: 'Work that shipped', impact: 'Results, measured', honors: 'Honors', contact: 'Contact',
    open: 'Scroll to unfold', explore: 'Explore the work', more: 'View details', less: 'Close details',
    live: 'Visit website', code: 'Source code', role: 'My contribution', current: 'Now',
    projectNotification: 'Scan · ~30s → ~200ms',
    contactNotification: 'Connect with Long', coverHint: 'Tap a notification to explore',
    contactHeading: 'Start a conversation.',
    contactIntro: 'Backend, automation, or an interesting problem — get in touch by email.',
    gallery: 'Project images', language: 'Language',
  },
}

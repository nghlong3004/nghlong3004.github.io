import type { Language, PortfolioPortrait } from '../types'

const src = '/portrait/entry-wallpaper.jpg'

export const portraits: Record<Language, PortfolioPortrait> = {
  vi: { src, alt: 'Ảnh chân dung do người dùng cung cấp' },
  en: { src, alt: 'User-supplied portrait photograph' },
}

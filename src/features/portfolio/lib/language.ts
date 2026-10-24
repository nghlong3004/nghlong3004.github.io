import type { Language } from '../types'

export function resolvePortfolioLanguage(saved: string | null, preferred: readonly string[]): Language {
  if (saved === 'vi' || saved === 'en') return saved
  for (const locale of preferred) {
    const language = locale.toLowerCase().split('-')[0]
    if (language === 'vi' || language === 'en') return language
  }
  return 'vi'
}

import { useEffect, useState } from 'react'
import type { Language } from '../types'

export function usePortfolioLanguage() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = window.localStorage.getItem('lang')
      return saved === 'en' ? 'en' : 'vi'
    } catch {
      return 'vi'
    }
  })

  useEffect(() => {
    try { window.localStorage.setItem('lang', language) } catch { /* Reading stays available without storage. */ }
    document.documentElement.lang = language
    document.title = 'Nguyen Hoang Long — Backend & Automation'
    document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'vi'
      ? 'Portfolio Nguyễn Hoàng Long: backend, automation, kinh nghiệm tại VinFast và các dự án thực tế.'
      : 'Nguyen Hoang Long: backend systems, test automation, experience at VinFast and selected projects.')
  }, [language])

  return { language, setLanguage }
}

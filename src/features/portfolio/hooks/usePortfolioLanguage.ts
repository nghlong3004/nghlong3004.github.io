import { useEffect, useState } from 'react'
import type { Language } from '../types'
import { resolvePortfolioLanguage } from '../lib/language'

export function usePortfolioLanguage() {
  const [language, updateLanguage] = useState<Language>(() => {
    let saved = null
    try { saved = window.localStorage.getItem('lang') } catch { /* Detection also works without storage. */ }
    const preferred = typeof navigator === 'undefined' ? []
      : navigator.languages?.length ? navigator.languages : navigator.language ? [navigator.language] : []
    return resolvePortfolioLanguage(saved, preferred)
  })

  const setLanguage = (next: Language) => {
    updateLanguage(next)
    try { window.localStorage.setItem('lang', next) } catch { /* Reading stays available without storage. */ }
  }

  useEffect(() => {
    document.documentElement.lang = language
    document.title = 'Nguyen Hoang Long — Backend & Automation'
    document.querySelector('meta[name="description"]')?.setAttribute('content', language === 'vi'
      ? 'Portfolio Nguyễn Hoàng Long: backend, automation, kinh nghiệm tại VinFast và các dự án thực tế.'
      : 'Nguyen Hoang Long: backend systems, test automation, experience at VinFast and selected projects.')
  }, [language])

  return { language, setLanguage }
}

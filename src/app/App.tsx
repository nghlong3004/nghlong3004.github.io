import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import FoldfolioDevice from '../features/foldfolio/FoldfolioDevice'
import type { PortfolioView } from '../features/portfolio/types'
import { PortfolioScreen } from '../features/portfolio/components/PortfolioScreen'
import { PortfolioCover } from '../features/portfolio/components/PortfolioCover'
import { PortfolioContact } from '../features/portfolio/components/PortfolioContact'
import { portfolio } from '../features/portfolio/data/portfolio'
import { entryPortrait } from '../features/portfolio/data/portrait'
import { usePortfolioLanguage } from '../features/portfolio/hooks/usePortfolioLanguage'
import { useVietnamClock } from '../features/portfolio/hooks/useVietnamClock'
import '../features/portfolio/styles/portfolio.css'
import { deviceConfig } from './config/device'
import { applyGlowDefault } from './config/scenePreference'
import { resolvePortfolioDestination } from '../features/portfolio/lib/navigation'

export default function App() {
  useLayoutEffect(() => {
    try { applyGlowDefault(window.localStorage) } catch { /* Storage can be unavailable. */ }
  }, [])
  const { time, age } = useVietnamClock()
  const { language, setLanguage } = usePortfolioLanguage()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [navigation, setNavigation] = useState<{ view: PortfolioView; target?: string; revision: number; open: boolean }>({ view: 'about', revision: 0, open: false })
  const entryFrame = useRef(0)
  useEffect(() => () => window.cancelAnimationFrame(entryFrame.current), [])
  const data = portfolio[language]
  const [nameLeft, nameRight] = data.profile.displayName.split(' ')
  const navigate = (destination: string) => {
    window.cancelAnimationFrame(entryFrame.current)
    const next = resolvePortfolioDestination(destination)
    if (next.project) setExpandedProject(next.project)
    setNavigation(current => ({ view: next.view, target: next.target, revision: current.revision + 1, open: true }))
  }
  const returnToEntry = () => {
    window.cancelAnimationFrame(entryFrame.current)
    setNavigation(current => ({ view: 'about', revision: current.revision, open: false }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    let attempts = 0
    const focusEntry = () => {
      if (window.scrollY < 1) {
        const button = Array.from(document.querySelectorAll<HTMLButtonElement>('.portfolio-cover__bottom button')).find(element => {
          const bounds = element.getBoundingClientRect()
          return bounds.width > 0 && bounds.top >= 0 && bounds.bottom <= window.innerHeight
        })
        button?.focus({ preventScroll: true })
      } else if (attempts++ < 180 && document.visibilityState !== 'hidden') entryFrame.current = window.requestAnimationFrame(focusEntry)
    }
    entryFrame.current = window.requestAnimationFrame(focusEntry)
  }
  const toggleProject = (id: string) => setExpandedProject((current) => current === id ? null : id)

  return (
    <>
      <button type="button" className="portfolio-brand" aria-label={`NGHLONG3004 — ${data.profile.name}`} onClick={returnToEntry}>NGHLONG3004</button>
      <div role="status" aria-live="polite" aria-atomic="true" className="portfolio-view-announcement">{navigation.open && `${data.ui.current}: ${{ about: data.ui.intro, work: data.ui.projects, experience: data.ui.experience, contact: data.ui.contact }[navigation.view]}`}</div>
      <div className="portfolio-language" role="group" aria-label={data.ui.language} hidden>
        <button type="button" lang="vi" aria-label="Tiếng Việt" aria-pressed={language === 'vi'} onClick={() => setLanguage('vi')}>VI</button>
        <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
      </div>
      <FoldfolioDevice
        {...deviceConfig}
        screenNavigation={navigation.open ? { key: `${navigation.view}:${navigation.revision}`, target: navigation.target || 'view-root' } : undefined}
        status={{ ...deviceConfig.status, time, batteryText: String(age), batteryLabel: language === 'vi'
          ? `${age} tuổi — không phải mức pin thiết bị`
          : `Age ${age} — not device battery level` }}
        nameLeft={<span className="portfolio-scene-name">{nameLeft}</span>}
        nameRight={<span className="portfolio-scene-name">{nameRight}</span>}
        screen={<PortfolioScreen key={navigation.revision} view={navigation.view} launch={navigation.open} data={data} expandedProject={expandedProject} onToggle={toggleProject} onNavigate={navigate} />}
        screenPortrait={<PortfolioScreen key={navigation.revision} view={navigation.view} launch={navigation.open} data={data} compact expandedProject={expandedProject} onToggle={toggleProject} onNavigate={navigate} />}
        cover={<PortfolioCover time={time} data={data} portrait={entryPortrait} onNavigate={navigate} />}
        coverPortrait={<PortfolioCover time={time} data={data} portrait={entryPortrait} compact onNavigate={navigate} />}
        call={<PortfolioContact data={data} onReturnToEntry={returnToEntry} />}
        callPortrait={<PortfolioContact data={data} compact onReturnToEntry={returnToEntry} />}
        nav={<nav className="portfolio-nav" aria-label={language === 'vi' ? 'Điều hướng hồ sơ' : 'Portfolio views'}>
          {[
            ['about', data.ui.intro],
            ['work', language === 'vi' ? 'Dự án' : 'Work'],
            ['experience', data.ui.experience],
            ['contact', data.ui.contact],
          ].map(([view, label]) => <button key={view} type="button" data-portfolio-destination={view} aria-current={navigation.view === view ? 'page' : undefined} onClick={() => navigate(view)}>{label}</button>)}
        </nav>}
        sceneImages={data.projects.map((project) => project.image)}
      />
    </>
  )
}

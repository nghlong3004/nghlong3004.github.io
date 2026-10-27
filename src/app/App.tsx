import { useEffect, useRef, useState } from 'react'
import '../features/portfolio/styles/portfolio.css'
import FoldfolioDevice from '../features/foldfolio/FoldfolioDevice'
import type { FoldfolioHandle } from '../features/foldfolio/types'
import type { PortfolioContactDraft, PortfolioContactValidation, PortfolioView } from '../features/portfolio/types'
import { PortfolioScreen } from '../features/portfolio/components/PortfolioScreen'
import { PortfolioCover } from '../features/portfolio/components/PortfolioCover'
import { PortfolioContact } from '../features/portfolio/components/PortfolioContact'
import { ProjectOverlay } from '../features/portfolio/components/kokonut/ProjectOverlay'
import { TechnologyLoopProvider } from '../features/portfolio/components/TechnologyLoop'
import { portfolio } from '../features/portfolio/data/portfolio'
import { usePortfolioLanguage } from '../features/portfolio/hooks/usePortfolioLanguage'
import { useVietnamClock } from '../features/portfolio/hooks/useVietnamClock'
import { deviceConfig } from './config/device'
import RainGlassBackground from './components/kokonut/RainGlassBackground'
import { isPortfolioNavigationNoop, resolvePortfolioDestination } from '../features/portfolio/lib/navigation'

export default function App() {
  const { time, age } = useVietnamClock()
  const { language, setLanguage } = usePortfolioLanguage()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [contactDraft, setContactDraft] = useState<PortfolioContactDraft>({ name: '', email: '', location: '', message: '' })
  const [contactValidation, setContactValidation] = useState<PortfolioContactValidation>({ touched: {}, submitted: false })
  const changeContactDraft = (field: keyof PortfolioContactDraft, value: string) => setContactDraft(current => ({ ...current, [field]: value }))
  const [navigation, setNavigation] = useState<{ view: PortfolioView; target?: string; revision: number; entryRevision: number; open: boolean }>({ view: 'home', revision: 0, entryRevision: 0, open: false })
  const entryFrame = useRef(0)
  const deviceRef = useRef<FoldfolioHandle>(null)
  useEffect(() => () => window.cancelAnimationFrame(entryFrame.current), [])
  const data = portfolio[language]
  const currentEmployer = data.experience.find(job => job.current)
  const navigate = (destination: string) => {
    const next = resolvePortfolioDestination(destination)
    if (isPortfolioNavigationNoop(navigation, next, expandedProject)) return
    window.cancelAnimationFrame(entryFrame.current)
    if (next.project) setExpandedProject(next.project)
    else if (next.view !== navigation.view) setExpandedProject(null)
    setNavigation(current => ({ view: next.view, target: next.target, revision: current.revision + 1,
      entryRevision: current.entryRevision + Number(current.open && current.view !== next.view), open: true }))
  }
  const returnToEntry = () => {
    window.cancelAnimationFrame(entryFrame.current)
    setExpandedProject(null)
    setNavigation(current => ({ view: 'home', revision: current.revision, entryRevision: current.entryRevision, open: false }))
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
  const focusContactField = (element: HTMLElement) => { deviceRef.current?.focusScreenElement(element) }
  const screen = <PortfolioScreen key={navigation.revision} view={navigation.view} launch={navigation.open} entryRevision={navigation.entryRevision} data={data} expandedProject={expandedProject} onToggle={toggleProject} onNavigate={navigate} contactDraft={contactDraft} onContactDraftChange={changeContactDraft} contactValidation={contactValidation} onContactValidationChange={setContactValidation} onContactFocusField={focusContactField} />
  const screenPortrait = <PortfolioScreen key={navigation.revision} view={navigation.view} launch={navigation.open} entryRevision={navigation.entryRevision} data={data} compact expandedProject={expandedProject} onToggle={toggleProject} onNavigate={navigate} contactDraft={contactDraft} onContactDraftChange={changeContactDraft} contactValidation={contactValidation} onContactValidationChange={setContactValidation} onContactFocusField={focusContactField} />

  return (
    <TechnologyLoopProvider>
      <RainGlassBackground src={data.profile.portrait.src} rain={0.6} interactive={false} className="portfolio-rain" />
      <button type="button" className="portfolio-brand" aria-label={`LONG — ${data.profile.name}`} onClick={returnToEntry}>
        <img src={`${import.meta.env.BASE_URL}LONG_Precision_L/primary-logo-transparent-graphite.svg`} alt="" width="156" height="50" />
      </button>
      <div role="status" aria-live="polite" aria-atomic="true" className="portfolio-view-announcement">{navigation.open && `${data.ui.current}: ${{ home: data.ui.home, work: data.ui.work, projects: data.ui.archive, about: data.ui.intro, contact: data.ui.contact }[navigation.view]}`}</div>
      <div className="portfolio-language" role="group" aria-label={data.ui.language} hidden>
        <button type="button" lang="vi" aria-label="Tiếng Việt" aria-pressed={language === 'vi'} onClick={() => setLanguage('vi')}>VI</button>
        <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
      </div>
      <FoldfolioDevice
        ref={deviceRef}
        {...deviceConfig}
        screenNavigation={navigation.open ? { key: `${navigation.view}:${navigation.revision}`, target: navigation.target || 'view-root' } : undefined}
        status={{ ...deviceConfig.status, time, employerLogo: currentEmployer?.logo ? {
          src: currentEmployer.logo, srcOnDark: currentEmployer.logoDark, label: currentEmployer.role,
        } : undefined, batteryText: String(age), batteryLabel: language === 'vi'
          ? `${age} tuổi — không phải mức pin thiết bị`
          : `Age ${age} — not device battery level` }}
        screen={screen}
        screenPortrait={screenPortrait}
        screenInteractive={screen}
        screenInteractivePortrait={screenPortrait}
        screenOverlay={<ProjectOverlay data={data} projectId={expandedProject} onClose={() => setExpandedProject(null)} />}
        cover={<PortfolioCover time={time} data={data} onNavigate={navigate} />}
        coverPortrait={<PortfolioCover time={time} data={data} compact onNavigate={navigate} />}
        call={<PortfolioContact data={data} onReturnToEntry={returnToEntry} />}
        callPortrait={<PortfolioContact data={data} compact onReturnToEntry={returnToEntry} />}
        nav={<nav className="portfolio-nav" aria-label={language === 'vi' ? 'Điều hướng hồ sơ' : 'Portfolio views'}>
          {[
            ['home', data.ui.home],
            ['about', data.ui.intro],
            ['projects', data.ui.archive],
            ['work', data.ui.work],
            ['contact', data.ui.contact],
          ].map(([view, label]) => <button key={view} type="button" data-portfolio-destination={view} aria-current={navigation.view === view ? 'page' : undefined} onPointerDown={event => {
            if (isPortfolioNavigationNoop(navigation, resolvePortfolioDestination(view), expandedProject)) event.preventDefault()
          }} onClick={() => navigate(view)}>{label}</button>)}
        </nav>}
      />
    </TechnologyLoopProvider>
  )
}

import { useLayoutEffect, useRef, useState } from 'react'
import FoldfolioDevice from '../features/foldfolio/FoldfolioDevice'
import type { FoldfolioHandle } from '../features/foldfolio/types'
import { PortfolioScreen } from '../features/portfolio/components/PortfolioScreen'
import { PortfolioCover } from '../features/portfolio/components/PortfolioCover'
import { PortfolioContact } from '../features/portfolio/components/PortfolioContact'
import { portfolio } from '../features/portfolio/data/portfolio'
import { usePortfolioLanguage } from '../features/portfolio/hooks/usePortfolioLanguage'
import { useVietnamClock } from '../features/portfolio/hooks/useVietnamClock'
import '../features/portfolio/styles/portfolio.css'
import { deviceConfig } from './config/device'
import { applyGlowDefault } from './config/scenePreference'

export default function App() {
  useLayoutEffect(() => {
    try { applyGlowDefault(window.localStorage) } catch { /* Storage can be unavailable. */ }
  }, [])
  const device = useRef<FoldfolioHandle>(null)
  const { time, age } = useVietnamClock()
  const { language, setLanguage } = usePortfolioLanguage()
  const [expandedProject, setExpandedProject] = useState<string | null>(null)
  const [selectedSection, setSelectedSection] = useState('intro')
  const data = portfolio[language]
  const [nameLeft, nameRight] = data.profile.displayName.split(' ')
  const navigate = (section: string) => {
    device.current?.scrollToSection(section)
    setSelectedSection(section.startsWith('project-') ? 'projects' : section)
  }
  const toggleProject = (id: string) => setExpandedProject((current) => current === id ? null : id)

  return (
    <>
      <button type="button" className="portfolio-brand" aria-label={`NGHLONG3004 — ${data.profile.name}`} onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}>NGHLONG3004</button>
      <div className="portfolio-language" role="group" aria-label={data.ui.language} hidden>
        <button type="button" lang="vi" aria-label="Tiếng Việt" aria-pressed={language === 'vi'} onClick={() => setLanguage('vi')}>VI</button>
        <button type="button" lang="en" aria-label="English" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
      </div>
      <FoldfolioDevice
        ref={device}
        {...deviceConfig}
        status={{ ...deviceConfig.status, time, batteryText: String(age), batteryLabel: language === 'vi'
          ? `${age} tuổi — không phải mức pin thiết bị`
          : `Age ${age} — not device battery level` }}
        nameLeft={<span className="portfolio-scene-name">{nameLeft}</span>}
        nameRight={<span className="portfolio-scene-name">{nameRight}</span>}
        screen={<PortfolioScreen data={data} expandedProject={expandedProject} onToggle={toggleProject} onNavigate={navigate} />}
        screenPortrait={<PortfolioScreen data={data} compact expandedProject={expandedProject} onToggle={toggleProject} onNavigate={navigate} />}
        cover={<PortfolioCover time={time} data={data} onNavigate={navigate} />}
        coverPortrait={<PortfolioCover time={time} data={data} compact onNavigate={navigate} />}
        call={<PortfolioContact data={data} />}
        callPortrait={<PortfolioContact data={data} compact />}
        nav={<nav className="portfolio-nav" aria-label={data.ui.intro}>
          {[
            ['intro', data.ui.intro],
            ['projects', language === 'vi' ? 'Dự án' : 'Work'],
            ['experience', data.ui.experience],
            ['contact', data.ui.contact],
          ].map(([section, label]) => <button key={section} type="button" aria-current={selectedSection === section ? 'location' : undefined} onClick={() => navigate(section)}>{label}</button>)}
        </nav>}
        sceneImages={data.projects.map((project) => project.image)}
      />
    </>
  )
}

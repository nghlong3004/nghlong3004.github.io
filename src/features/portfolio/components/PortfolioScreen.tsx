import type { CSSProperties } from 'react'
import type { PortfolioData, PortfolioView } from '../types'
import { AboutView } from './views/AboutView'
import { WorkView } from './views/WorkView'
import { ExperienceView } from './views/ExperienceView'
import { ContactView } from './views/ContactView'

export function PortfolioScreen({ data, view, launch = false, compact = false, expandedProject, onToggle, onNavigate, style }: {
  data: PortfolioData
  view: PortfolioView
  launch?: boolean
  compact?: boolean
  expandedProject: string | null
  onToggle: (id: string) => void
  onNavigate: (destination: string) => void
  style?: CSSProperties
}) {
  const label = { about: data.ui.intro, work: data.ui.projects, experience: data.ui.experience, contact: data.ui.contact }[view]
  return (
    <div className={`portfolio-screen${compact ? ' portfolio-screen--compact' : ''}${launch ? ' portfolio-screen--launch' : ''}`}
      data-portfolio-view={view} data-ff-section="view-root" role="region" aria-label={label} tabIndex={-1} style={style}>
      {view === 'about' ? <AboutView data={data} onNavigate={onNavigate} />
        : view === 'work' ? <WorkView data={data} expandedProject={expandedProject} onToggle={onToggle} />
          : view === 'experience' ? <ExperienceView data={data} />
            : <ContactView data={data} />}
    </div>
  )
}

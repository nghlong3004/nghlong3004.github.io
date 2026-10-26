import type { CSSProperties } from 'react'
import type { PortfolioView, PortfolioViewProps } from '../types'
import { AboutView } from './views/AboutView'
import { WorkView } from './views/WorkView'
import { ContactView } from './views/ContactView'
import { HomeView } from './views/HomeView'
import { ProjectsView } from './views/ProjectsView'

export function PortfolioScreen({ data, view, launch = false, compact = false, expandedProject, onToggle, onNavigate, contactDraft, onContactDraftChange, contactValidation, onContactValidationChange, onContactFocusField, style }: {
  view: PortfolioView
  launch?: boolean
  compact?: boolean
  style?: CSSProperties
} & PortfolioViewProps) {
  const label = { home: data.ui.home, work: data.ui.work, projects: data.ui.archive, about: data.ui.intro, contact: data.ui.contact }[view]
  const viewProps: PortfolioViewProps = { data, expandedProject, onToggle, onNavigate, contactDraft, onContactDraftChange, contactValidation, onContactValidationChange, onContactFocusField }
  return (
    <div className={`portfolio-screen${compact ? ' portfolio-screen--compact' : ''}${launch ? ' portfolio-screen--launch' : ''}`}
      data-portfolio-view={view} data-ff-section="view-root" data-ff-motion="composition" role="region" aria-label={label} tabIndex={-1} style={style}>
      {view === 'home' ? <HomeView {...viewProps} />
        : view === 'about' ? <AboutView {...viewProps} />
        : view === 'projects' ? <ProjectsView {...viewProps} />
        : view === 'work' ? <WorkView {...viewProps} />
            : <ContactView {...viewProps} />}
    </div>
  )
}

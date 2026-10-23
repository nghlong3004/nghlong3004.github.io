import type { CSSProperties } from 'react'
import type { PortfolioData } from '../types'
import { Portrait } from './Portrait'
import { Icon } from './Icon'

export function PortfolioCover({ data, time, compact = false, onNavigate, style }: {
  data: PortfolioData
  time: string
  compact?: boolean
  onNavigate: (section: string) => void
  style?: CSSProperties
}) {
  const current = data.experience.find((job) => job.current)
  const project = data.projects.find((item) => item.id === 'vinqa')
  return (
    <div data-ui="" className={`portfolio-cover${compact ? ' portfolio-cover--compact' : ''}`} style={style}>
      <Portrait portrait={data.profile.portrait} className="portfolio-cover__portrait" />
      <header className="portfolio-cover__identity">
        <p className="portfolio-cover__clock">{time}</p>
        <p className="portfolio-cover__name">{data.profile.name}</p>
        <p className="portfolio-cover__role">{data.profile.role}</p>
      </header>
      <div className="portfolio-notifications">
        {current && <button type="button" className="portfolio-notification" onClick={() => onNavigate('experience')}>
          <span className="portfolio-notification__app"><img src={current.logo || '/favicon.webp'} alt="" width="28" height="28" /></span>
          <span><strong>{current.role}</strong><span>{current.period}</span></span>
        </button>}
        {project && <button type="button" className="portfolio-notification" onClick={() => onNavigate(`project-${project.id}`)}>
          <img src={project.image.src} alt="" width="36" height="36" />
          <span><strong>{project.title}</strong><span>{data.ui.projectNotification}</span></span>
        </button>}
        <a className="portfolio-notification" href={`mailto:${data.profile.email}`}>
          <span className="portfolio-notification__app"><Icon name="mail" size={18} /></span>
          <span><strong>{data.ui.contactNotification}</strong><span>{data.profile.email}</span></span>
        </a>
      </div>
      <div className="portfolio-cover__bottom">
        <p>{data.ui.coverHint}</p>
        <button type="button" onClick={() => onNavigate('intro')}>{data.ui.open} <Icon name="up" size={13} /></button>
      </div>
    </div>
  )
}

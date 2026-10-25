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
  const linkedIn = data.links.find((link) => link.icon === 'linkedin')
  const instagram = data.links.find((link) => link.icon === 'instagram')
  return (
    <div data-ui="" aria-label={data.profile.name} className={`portfolio-cover${compact ? ' portfolio-cover--compact' : ''}`} style={style}>
      <Portrait portrait={data.profile.portrait} className="portfolio-cover__portrait" />
      <header className="portfolio-cover__identity">
        <p className="portfolio-cover__clock">{time}</p>
        <p className="portfolio-cover__role">{data.profile.role}</p>
      </header>
      <div className="portfolio-notifications">
        {current && <button type="button" className="portfolio-notification" aria-label={`${data.ui.employmentNotificationTitle}. ${current.role}. ${data.ui.employmentNotificationSubtitle}`} onClick={() => onNavigate('job-current')}>
          <span className="portfolio-notification__app"><img src={current.logo || `${import.meta.env.BASE_URL}LONG_Precision_L/favicon.svg`} alt="" width="28" height="28" /></span>
          <span><strong>{data.ui.employmentNotificationTitle}</strong><span>{data.ui.employmentNotificationSubtitle}</span></span>
        </button>}
        {project && <button type="button" className="portfolio-notification" onClick={() => onNavigate(`project-${project.id}`)}>
          <img src={project.image.src} alt="" width="36" height="36" />
          <span><strong>{project.title}</strong><span>{data.ui.projectNotification}</span></span>
        </button>}
      </div>
      <div className="portfolio-cover__bottom">
        {instagram && <a className="portfolio-cover__shortcut" href={instagram.url} aria-label={instagram.label} target="_blank" rel="noreferrer"><Icon name={instagram.icon} size={24} /></a>}
        <button type="button" onClick={() => onNavigate('intro')}>{data.ui.open}</button>
        {linkedIn && <a className="portfolio-cover__shortcut" href={linkedIn.url} aria-label={linkedIn.label} target="_blank" rel="noreferrer"><Icon name={linkedIn.icon} size={24} /></a>}
      </div>
    </div>
  )
}

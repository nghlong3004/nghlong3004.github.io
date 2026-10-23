import type { CSSProperties } from 'react'
import type { PortfolioData } from '../types'
import { Portrait } from './Portrait'
import { Icon } from './Icon'

export function PortfolioContact({ data, compact = false, style }: {
  data: PortfolioData
  compact?: boolean
  style?: CSSProperties
}) {
  return (
    <div className={`portfolio-call${compact ? ' portfolio-call--compact' : ''}`} style={style}>
      <p className="portfolio-call__name">{data.profile.name}</p>
      <p>{data.ui.contactHeading}</p>
      <Portrait portrait={data.profile.portrait} className="portfolio-call__portrait" />
      <a className="portfolio-call__action" href={`mailto:${data.profile.email}`}><span><Icon name="phone" size={22} /></span>{data.ui.contact}</a>
      <a className="portfolio-call__email" href={`mailto:${data.profile.email}`}>{data.profile.email}</a>
      <div className="portfolio-socials">{data.links.filter((link) => link.label !== 'Email').map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <Icon size={13} /></a>)}</div>
    </div>
  )
}

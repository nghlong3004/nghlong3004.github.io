import type { CSSProperties } from 'react'
import type { PortfolioData } from '../types'
import { Portrait } from './Portrait'
import { Icon } from './Icon'
import SlideToConfirm from './kokonut/SlideToConfirm'

export function PortfolioContact({ data, compact = false, onReturnToEntry, style }: {
  data: PortfolioData
  compact?: boolean
  onReturnToEntry: () => void
  style?: CSSProperties
}) {
  return (
    <div className={`portfolio-call${compact ? ' portfolio-call--compact' : ''}`} style={style}>
      <p className="portfolio-call__name">{data.profile.name}</p>
      <Portrait portrait={data.profile.portrait} className="portfolio-call__portrait" />
      <div className="portfolio-call__completion"><SlideToConfirm label={data.ui.slideReturn} confirmingLabel={data.ui.returning} doneLabel={data.ui.returned} keyboardHint={data.ui.confirmHint} onConfirm={onReturnToEntry} /></div>
      <div className="portfolio-socials">{data.links.filter((link) => link.icon === 'github' || link.icon === 'linkedin').map((link) => <a key={link.url} href={link.url} aria-label={link.label} target="_blank" rel="noreferrer"><Icon name={link.icon} size={24} /></a>)}</div>
    </div>
  )
}

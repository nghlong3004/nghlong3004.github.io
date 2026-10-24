import type { PortfolioPortrait } from '../types'

export function Portrait({ portrait, className = '' }: { portrait: PortfolioPortrait; className?: string }) {
  return <img className={`portfolio-portrait ${className}`} src={portrait.src} alt={portrait.alt} />
}

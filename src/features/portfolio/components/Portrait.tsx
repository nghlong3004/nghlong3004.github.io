import type { PortfolioPortrait } from '../types'

export function Portrait({ portrait, className = '' }: { portrait: PortfolioPortrait; className?: string }) {
  if (portrait.referenceCrop) {
    // Frame the supplied reference directly; the source screenshot remains untouched.
    return <svg className={`portfolio-portrait ${className}`} viewBox="610 124 286 322" preserveAspectRatio="xMidYMid slice" role="img" aria-label={portrait.alt}>
      <image href={portrait.src} x="0" y="0" width="1224" height="588" />
    </svg>
  }
  return <img className={`portfolio-portrait ${className}`} src={portrait.src} alt={portrait.alt} />
}

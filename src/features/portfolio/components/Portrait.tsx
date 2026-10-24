import type { PortfolioPortrait } from '../types'

export function Portrait({ portrait, className = '', fit = 'cover' }: { portrait: PortfolioPortrait; className?: string; fit?: 'cover' | 'contain' }) {
  if (portrait.referenceCrop) {
    // Frame the supplied reference directly; the source screenshot remains untouched.
    return <svg className={`portfolio-portrait ${className}`} viewBox={fit === 'contain' ? '610 86 280 360' : '610 124 286 322'} preserveAspectRatio={fit === 'contain' ? 'xMidYMax meet' : 'xMidYMid slice'} role="img" aria-label={portrait.alt}>
      <svg x="610" y="124" width="280" height="322" viewBox="610 124 280 322" overflow="hidden">
        <image href={portrait.src} x="0" y="0" width="1224" height="588" />
      </svg>
    </svg>
  }
  return <img className={`portfolio-portrait ${className}`} src={portrait.src} alt={portrait.alt} style={{ objectFit: fit }} />
}

import type { Language } from '../types'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { TechnologyLoopContext } from '../hooks/useTechnologyLoop'
import type { TechnologyLoopRegistry } from '../hooks/useTechnologyLoop'
import { getTechnologyIcon } from '../lib/technologyIcons'
import { LogoLoop } from './reactbits/LogoLoop'
import '../styles/technology-loop.css'

export function TechnologyLoopProvider({ children }: { children: ReactNode }) {
  const [registry] = useState<TechnologyLoopRegistry>(() => new Map())
  return <TechnologyLoopContext.Provider value={registry}>{children}</TechnologyLoopContext.Provider>
}

export function TechnologyLoop({ technologies, syncKey, language }: {
  technologies: string[]
  syncKey: string
  language: Language
}) {
  const labels = [...new Set(technologies)]
  const logos = labels.map(title => {
    const technology = getTechnologyIcon(title)
    const Brand = technology?.icon
    return {
      title,
      hoverColor: technology?.color,
      node: Brand ? <Brand aria-hidden="true" focusable="false" />
        : technology?.src ? <img src={technology.src} alt="" aria-hidden="true" width={48} height={48} />
          : <span className="technology-loop__fallback" aria-hidden="true">{title}</span>,
    }
  })
  if (!logos.length) return null
  return <LogoLoop logos={logos} syncKey={syncKey}
    ariaLabel={language === 'vi' ? 'Công nghệ trong các dự án' : 'Technologies used in projects'}
  />
}

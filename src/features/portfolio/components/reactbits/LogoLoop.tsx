/**
 * React Bits LogoLoop — David Haz, MIT + Commons Clause (LICENSE.react-bits.txt).
 * https://github.com/DavidHDev/react-bits/tree/e12c22192ac7b4b452c5e2feb9b586d74765d696
 * Adapted from src/ts-default/Animations/LogoLoop/LogoLoop.tsx + LogoLoop.css.
 * Line-only adaptation: upstream list/node markup, 48px logos, 56px gap and hover scale.
 * Replaces upstream engine with a shared provider timeline and layout-space measurement;
 * omits links, drag, curved layouts, reduced-motion bypass and all unused advanced API.
 * This is not the complete upstream component/API or an unmodified source copy.
 */
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { useTechnologyLoop } from '../../hooks/useTechnologyLoop'
import '../../styles/logo-loop.css'

export interface LogoItem { node: ReactNode; title: string; hoverColor?: string }

export function LogoLoop({ logos, syncKey, ariaLabel }: {
  logos: LogoItem[]
  syncKey: string
  ariaLabel: string
}) {
  const track = useRef<HTMLDivElement>(null)
  const first = useRef<HTMLUListElement>(null)
  const period = useRef(0)
  const [copies, setCopies] = useState(2)
  const { root, refresh } = useTechnologyLoop(syncKey, ({ distance, intro }) => {
    if (!track.current || !period.current) return
    track.current.style.transform = `translate3d(${-distance % period.current}px,0,0)`
    track.current.style.opacity = String(intro)
  })

  useEffect(() => {
    const element = root.current
    const list = first.current
    if (!element || !list) return
    const measure = () => {
      // Offsets/client sizes are layout pixels, unaffected by folding/perspective transforms.
      period.current = list.offsetWidth
      if (period.current > 0) setCopies(Math.max(2, Math.ceil(element.clientWidth / period.current) + 1))
      refresh()
    }
    measure()
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure)
    observer?.observe(element)
    observer?.observe(list)
    if (!observer) window.addEventListener('resize', measure)
    // Font swaps can alter text fallbacks even when the screen itself did not resize.
    let alive = true
    void document.fonts?.ready.then(() => { if (alive) measure() })
    return () => { alive = false; observer?.disconnect(); window.removeEventListener('resize', measure) }
  }, [logos, root, refresh])

  return <div className="technology-loop" ref={root} data-technology-loop={syncKey}>
    <div className="logoloop logoloop--horizontal logoloop--scale-hover" role="region" aria-label={ariaLabel} tabIndex={0}>
      <div className="logoloop__track" ref={track}>
        {Array.from({ length: copies }, (_, copy) => <ul
          className="logoloop__list" role="list" key={copy} ref={copy === 0 ? first : undefined}
          aria-hidden={copy === 0 ? undefined : true} inert={copy === 0 ? undefined : true}
        >
          {logos.map(item => <li className="logoloop__item" role="listitem" key={item.title}>
            <span className="logoloop__content" style={{ color: item.hoverColor }}>
              <span className="logoloop__node">{item.node}</span>
              <span className="technology-loop__name">{item.title}</span>
            </span>
          </li>)}
        </ul>)}
      </div>
    </div>
  </div>
}

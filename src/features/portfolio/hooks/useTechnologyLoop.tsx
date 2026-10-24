import { createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { createTechnologyLoopController } from './technologyLoopController'
import type { LoopFrame, TechnologyLoopController } from './technologyLoopController'

export type TechnologyLoopRegistry = Map<string, { controller: TechnologyLoopController; users: number }>
export const TechnologyLoopContext = createContext<TechnologyLoopRegistry | null>(null)

export function useTechnologyLoop(syncKey: string, paint: (frame: LoopFrame) => void) {
  const registry = useContext(TechnologyLoopContext)
  const root = useRef<HTMLDivElement>(null)
  const controller = useRef<TechnologyLoopController | null>(null)
  const paintRef = useRef(paint)
  useEffect(() => { paintRef.current = paint })

  useEffect(() => {
    const element = root.current
    if (!element) return
    // Standalone/SSR consumers compile without App wiring; shared copies require the provider.
    let entry = registry?.get(syncKey)
    if (!entry) {
      entry = { controller: createTechnologyLoopController(), users: 0 }
      registry?.set(syncKey, entry)
    }
    entry.users++
    const current = entry.controller
    controller.current = current
    const hover = Symbol('hover')
    const focus = Symbol('focus')
    let visible = typeof IntersectionObserver === 'undefined'
    const active = () => visible && !document.hidden && element.isConnected
      && !element.closest('[inert], [aria-hidden="true"], [hidden]')
    const release = current.register({
      active,
      paint: frame => { if (element.isConnected) paintRef.current(frame) },
    })
    const refresh = () => {
      // Inactive copies must not leave a stale hover/focus token blocking the shared clock.
      current.pause(hover, active() && element.matches(':hover'))
      current.pause(focus, active() && element.contains(document.activeElement))
      current.refresh()
    }
    const enter = () => current.pause(hover, active())
    const leave = () => current.pause(hover, false)
    const focusIn = () => current.pause(focus, active())
    const focusOut = (event: FocusEvent) => {
      if (!element.contains(event.relatedTarget as Node | null)) current.pause(focus, false)
    }
    element.addEventListener('mouseenter', enter)
    element.addEventListener('mouseleave', leave)
    element.addEventListener('focusin', focusIn)
    element.addEventListener('focusout', focusOut)
    document.addEventListener('visibilitychange', refresh)
    const intersection = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
      visible = entries[entries.length - 1].isIntersecting
      refresh()
    })
    intersection?.observe(element)
    // Canonical flat/fold activity changes on ancestors without remounting the screen.
    const activity = new MutationObserver(refresh)
    for (let parent: HTMLElement | null = element; parent; parent = parent.parentElement) {
      activity.observe(parent, { attributes: true, attributeFilter: ['inert', 'aria-hidden', 'hidden'] })
    }
    return () => {
      intersection?.disconnect()
      activity.disconnect()
      document.removeEventListener('visibilitychange', refresh)
      element.removeEventListener('mouseenter', enter)
      element.removeEventListener('mouseleave', leave)
      element.removeEventListener('focusin', focusIn)
      element.removeEventListener('focusout', focusOut)
      release()
      current.pause(hover, false)
      current.pause(focus, false)
      controller.current = null
      if (--entry.users === 0) {
        current.destroy()
        registry?.delete(syncKey)
      }
    }
  }, [registry, syncKey])

  const refresh = useCallback(() => controller.current?.refresh(), [])
  return { root, refresh }
}

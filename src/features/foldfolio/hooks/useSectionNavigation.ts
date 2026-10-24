import { useEffect, useImperativeHandle, useRef } from 'react'
import type { Ref, RefObject } from 'react'
import type { FoldfolioHandle } from '../types'
import type { GeometryState, LiveState } from '../engine/types'
import type { DeviceRefs } from './useDeviceRefs'
import { getSectionScrollY } from '../engine/navigation'
import { takeSnapshot, releaseSnapshot } from '../engine/snapshots'

export function useSectionNavigation(
  ref: Ref<FoldfolioHandle> | undefined,
  rootRef: RefObject<HTMLDivElement | null>,
  refs: DeviceRefs,
  geometry: RefObject<GeometryState>,
  live: RefObject<LiveState>,
  jump: RefObject<(top: number) => void>,
) {
  const snapshot = useRef<ReturnType<typeof takeSnapshot>>(undefined)
  const frame = useRef(0)
  const fallback = useRef(0)
  useEffect(() => () => {
    window.cancelAnimationFrame(frame.current)
    window.clearTimeout(fallback.current)
    if (snapshot.current) releaseSnapshot(0, snapshot.current)
  }, [])

  useImperativeHandle(ref, () => ({
    scrollToSection(sectionKey) {
      const root = rootRef.current
      const screen = refs.cOpen.current || refs.cR.current
      if (!root || !screen) return
      const target = Array.from(screen.querySelectorAll<HTMLElement>('[data-ff-section]'))
        .find((element) => element.dataset.ffSection === sectionKey)
      if (!target) return

      // Offset geometry ignores the scaling and 3D transforms of the two screen copies.
      let top = 0
      let element: HTMLElement | null = target
      while (element && element !== screen) {
        top += element.offsetTop
        element = element.offsetParent as HTMLElement | null
      }
      if (element !== screen) return
      const rootTop = root.getBoundingClientRect().top + window.scrollY
      const destination = getSectionScrollY(rootTop, top, geometry.current)
      if (Math.abs(window.scrollY - destination) < 1 &&
          Math.abs(live.current.cur - (destination - rootTop)) < 1) return

      window.cancelAnimationFrame(frame.current)
      window.clearTimeout(fallback.current)
      if (snapshot.current) releaseSnapshot(0, snapshot.current)
      snapshot.current = undefined
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const hidden = document.visibilityState === 'hidden'
      const open = geometry.current.mode === 'open' || live.current.pe === 1
      if (!open && !reduced && !hidden) {
        window.scrollTo({ top: destination, behavior: 'smooth' })
        return
      }
      const outgoing = open && !reduced && !hidden && refs.stage.current
        ? takeSnapshot(refs.stage.current, true) : undefined
      snapshot.current = outgoing
      jump.current(destination)
      if (outgoing) {
        // Keep the outgoing stage until the destination and App-owned nav have painted.
        frame.current = window.requestAnimationFrame(() => {
          frame.current = window.requestAnimationFrame(() => releaseSnapshot(360, outgoing))
        })
        fallback.current = window.setTimeout(() => releaseSnapshot(360, outgoing), 500)
      }
    },
  }), [rootRef, refs, geometry, live, jump])
}

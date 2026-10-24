import { useImperativeHandle, useRef } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { Ref, RefObject } from 'react'
import type { FoldfolioHandle, FoldfolioProps } from '../types'
import type { GeometryState, LiveState } from '../engine/types'
import type { DeviceRefs } from './useDeviceRefs'
import { getSectionScrollY } from '../engine/navigation'
import { takeSnapshot, releaseSnapshot } from '../engine/snapshots'
import { useIsoLayoutEffect } from './useIsoLayoutEffect'

function sectionTop(screen: HTMLElement, target: HTMLElement) {
  let top = 0
  let element: HTMLElement | null = target
  while (element && element !== screen) {
    top += element.offsetTop
    element = element.offsetParent as HTMLElement | null
  }
  return element === screen ? top : null
}

function findSection(screen: HTMLElement, key: string) {
  return Array.from(screen.querySelectorAll<HTMLElement>('[data-ff-section]'))
    .find(element => element.dataset.ffSection === key)
}

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
  const cancel = useRef<() => void>(() => {})
  const reveal = useRef<(element: HTMLElement) => boolean>(() => false)
  reveal.current = (element) => {
    const root = rootRef.current
    const screen = refs.cInteractive?.current
    if (!root || !screen || screen.inert || !element.isConnected || !screen.contains(element)) return false
    const top = sectionTop(screen, element)
    if (top === null) return false
    const g = geometry.current
    const inner = live.current.inner
    let upper = 52
    let lower = g.Hs - 84
    const viewport = window.visualViewport
    const screenTop = refs.overlay?.current?.getBoundingClientRect().top
    if (viewport && screenTop !== undefined) {
      // Only the focus reveal follows the visual viewport; hardware geometry stays unchanged.
      upper = Math.max(upper, (viewport.offsetTop - screenTop) / (g.s || 1) + 20)
      lower = Math.min(lower, (viewport.offsetTop + viewport.height - screenTop) / (g.s || 1) - 20)
    }
    const visibleTop = top - inner
    let next = inner
    if (visibleTop < upper) next = top - upper
    else if (visibleTop + element.offsetHeight > lower)
      next = lower > upper + element.offsetHeight
        ? top + element.offsetHeight - lower : top - upper
    next = Math.max(0, Math.min(next, g.innerMax))
    if (Math.abs(next - inner) > 1) {
      const rootTop = root.getBoundingClientRect().top + window.scrollY
      jump.current(rootTop + (g.mode === 'fold' ? g.U1 : 0) + next * g.s)
    }
    return true
  }
  useIsoLayoutEffect(() => {
    cancel.current = () => {
      window.cancelAnimationFrame(frame.current)
      window.clearTimeout(fallback.current)
      if (snapshot.current) releaseSnapshot(0, snapshot.current)
      snapshot.current = undefined
    }
    return () => {
      cancel.current()
      cancel.current = () => {}
    }
  }, [])
  useIsoLayoutEffect(() => {
    const viewport = window.visualViewport
    if (!viewport) return
    let frame = 0
    const update = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(() => {
        if (document.activeElement instanceof HTMLElement)
          reveal.current(document.activeElement)
      })
    }
    viewport.addEventListener('resize', update)
    viewport.addEventListener('scroll', update)
    return () => {
      viewport.removeEventListener('resize', update)
      viewport.removeEventListener('scroll', update)
      window.cancelAnimationFrame(frame)
    }
  }, [])
  useIsoLayoutEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (document.activeElement instanceof HTMLElement)
        reveal.current(document.activeElement)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [geometry.current.s, geometry.current.Hs, geometry.current.port, geometry.current.innerMax])

  useImperativeHandle(ref, () => ({
    scrollToSection(sectionKey) {
      const root = rootRef.current
      const screen = refs.cInteractive?.current || refs.cOpen.current || refs.cR.current
      if (!root || !screen) return
      const target = findSection(screen, sectionKey)
      if (!target) return

      // Offset geometry ignores the scaling and 3D transforms of the two screen copies.
      const top = sectionTop(screen, target)
      if (top === null) return
      const rootTop = root.getBoundingClientRect().top + window.scrollY
      const destination = getSectionScrollY(rootTop, top, geometry.current)
      if (Math.abs(window.scrollY - destination) < 1 &&
          Math.abs(live.current.cur - (destination - rootTop)) < 1) return

      cancel.current()
      const hidden = document.visibilityState === 'hidden'
      const open = geometry.current.mode === 'open' || live.current.pe === 1
      if (!open && !hidden) {
        window.scrollTo({ top: destination, behavior: 'smooth' })
        return
      }
      const outgoing = open && !hidden && refs.stage.current
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
    focusScreenElement(element) {
      if (!reveal.current(element)) return false
      element.focus({ preventScroll: true })
      return document.activeElement === element
    },
  }), [rootRef, refs, geometry, live, jump])
  return { cancel, reveal }
}

// A key denotes a new screen request, not an anchor on a concatenated page. Reconcile
// the new content's height before the browser can paint a shorter view at the old offset.
export function useScreenNavigationRequest({ request, rootRef, measureRef, refs, geometry, live,
  jump, cancelSection, contentH, setContentH, isCanvas,
}: {
  request: FoldfolioProps['screenNavigation']
  rootRef: RefObject<HTMLDivElement | null>
  measureRef: RefObject<HTMLDivElement | null>
  refs: DeviceRefs
  geometry: RefObject<GeometryState>
  live: RefObject<LiveState>
  jump: RefObject<(top: number) => void>
  cancelSection: RefObject<() => void>
  contentH: number
  setContentH: Dispatch<SetStateAction<number>>
  isCanvas: boolean
}) {
  const active = useRef<string | undefined>(undefined)
  const settled = useRef<string | undefined>(undefined)
  const previous = useRef<{
    rootTop: number; mode: GeometryState['mode']; s: number; U1: number; U2: number;
    U3: number; innerMax: number; Hs: number; port: boolean
  } | undefined>(undefined)
  useIsoLayoutEffect(() => {
    if (!request || isCanvas || !rootRef.current || !measureRef.current) {
      if (!request && active.current !== undefined) {
        active.current = settled.current = undefined
        previous.current = undefined
      }
      return
    }
    const root = rootRef.current
    const g = geometry.current
    const measured = measureRef.current.offsetHeight || g.Hs
    const rootTop = root.getBoundingClientRect().top + window.scrollY
    const openTop = rootTop + (g.mode === 'fold' ? g.U1 : 0)
    const first = active.current !== request.key
    if (first) {
      active.current = request.key
      settled.current = undefined
      previous.current = undefined
      cancelSection.current()
      // Stop any old native smooth scroll and reset the old content offset while
      // the old (possibly taller) timeline still exists in the DOM.
      if (g.mode === 'open' || live.current.pe >= 0.999) jump.current(openTop)
      else window.scrollTo({ top: window.scrollY, behavior: 'instant' })
    }
    if (contentH !== measured) {
      setContentH(measured)
      return
    }
    const last = previous.current
    if (settled.current === request.key) {
      const resized = last && (last.s !== g.s || last.U1 !== g.U1 || last.U2 !== g.U2 ||
        last.U3 !== g.U3 || last.Hs !== g.Hs || last.port !== g.port || last.mode !== g.mode)
      if (last && resized) {
        const oldStart = last.rootTop + (last.mode === 'fold' ? last.U1 : 0)
        const oldEnd = oldStart + last.innerMax * last.s
        const newEnd = openTop + g.innerMax * g.s
        const y = window.scrollY
        let destination = y
        if (last.mode === 'fold' && y >= last.rootTop && y < oldStart) {
          destination = rootTop + (y - last.rootTop) * g.U1 / (last.U1 || 1)
        } else if (last.mode === 'fold' && y > oldEnd && y <= oldEnd + last.U2 + last.U3) {
          const oldCloseEnd = oldEnd + last.U2
          destination = y <= oldCloseEnd
            ? newEnd + (y - oldEnd) * g.U2 / (last.U2 || 1)
            : newEnd + g.U2 + (y - oldCloseEnd) * g.U3 / (last.U3 || 1)
        } else if (y >= last.rootTop && y <= oldEnd) {
          destination = openTop + Math.max(0, Math.min((y - oldStart) / (last.s || 1), g.innerMax)) * g.s
        }
        if (Math.abs(y - destination) > 1) jump.current(destination)
      } else if (last && g.innerMax < last.innerMax && live.current.pe >= 0.999) {
        // Content can shrink after a request has settled; keep the open screen at its last valid offset.
        const end = openTop + g.innerMax * g.s
        const oldEnd = openTop + last.innerMax * g.s
        if (window.scrollY > end && window.scrollY <= oldEnd + 1) jump.current(end)
      }
      previous.current = { rootTop, mode: g.mode, s: g.s, U1: g.U1, U2: g.U2,
        U3: g.U3, innerMax: g.innerMax, Hs: g.Hs, port: g.port }
      return
    }
    const screen = refs.cInteractive?.current ||
      (g.mode === 'fold' ? refs.cR.current : refs.cOpen.current)
    if (!screen) return
    const target = findSection(screen, request.target || 'view-root') || findSection(screen, 'view-root')
    if (!target) return
    const top = sectionTop(screen, target)
    if (top === null) return
    const destination = getSectionScrollY(rootTop, top, g)
    const unfolded = g.mode === 'open' || live.current.pe >= 0.999
    if (unfolded || document.visibilityState === 'hidden') jump.current(destination)
    else window.scrollTo({ top: destination, behavior: 'smooth' })
    previous.current = { rootTop, mode: g.mode, s: g.s, U1: g.U1, U2: g.U2,
      U3: g.U3, innerMax: g.innerMax, Hs: g.Hs, port: g.port }

    let frame = 0
    let attempts = 0
    const events = ['wheel', 'touchstart', 'pointerdown', 'keydown']
    const detach = () => events.forEach(event => window.removeEventListener(event, interrupt))
    const interrupt = () => {
      settled.current = request.key
      detach()
      window.scrollTo({ top: window.scrollY, behavior: 'instant' })
      window.cancelAnimationFrame(frame)
    }
    for (const event of events)
      window.addEventListener(event, interrupt, { passive: true })
    const focusWhenReady = () => {
      if (settled.current === request.key || active.current !== request.key) return
      if (!target.isConnected || document.visibilityState === 'hidden') {
        settled.current = request.key
        detach()
        return
      }
      if (Math.abs(window.scrollY - destination) < 2 &&
          (g.mode === 'open' || live.current.pe >= 0.999)) {
        target.focus({ preventScroll: true })
        settled.current = request.key
        detach()
      } else if (attempts++ < 180) {
        frame = window.requestAnimationFrame(focusWhenReady)
      } else {
        settled.current = request.key
        detach()
      }
    }
    frame = window.requestAnimationFrame(focusWhenReady)
    return () => {
      window.cancelAnimationFrame(frame)
      detach()
    }
  }, [request?.key, request?.target, contentH, isCanvas,
    geometry.current.s, geometry.current.U1, geometry.current.U2, geometry.current.U3,
    geometry.current.Hs, geometry.current.port])
}

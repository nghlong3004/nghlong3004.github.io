import { useImperativeHandle } from 'react'
import type { Ref, RefObject } from 'react'
import type { FoldfolioHandle } from '../types'
import type { GeometryState } from '../engine/types'
import type { DeviceRefs } from './useDeviceRefs'
import { getSectionScrollY } from '../engine/navigation'

export function useSectionNavigation(
  ref: Ref<FoldfolioHandle> | undefined,
  rootRef: RefObject<HTMLDivElement | null>,
  refs: DeviceRefs,
  geometry: RefObject<GeometryState>,
) {
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
      window.scrollTo({
        top: getSectionScrollY(rootTop, top, geometry.current),
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      })
    },
  }), [rootRef, refs, geometry])
}

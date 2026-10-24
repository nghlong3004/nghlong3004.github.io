/**
 * Adapted from Kokonut UI Smooth Drawer v2.0.0 by @dorianbaffier (MIT).
 * https://kokonutui.com/r/smooth-drawer.json
 * Device-local Motion shell replaces Vaul/body portal; checkout becomes project content.
 * Rounded sheet, pill handle, two snap heights and upstream easing are retained.
 */
import { useEffectEvent, useId, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { PortfolioData, PortfolioProject } from '../../types'
import { ContentBlocks } from '../ContentBlocks'
import { Icon } from '../Icon'
import '../../styles/project-overlay.css'

const EASE_OUT = [0.23, 1, 0.32, 1] as const
const FOCUSABLE = 'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'

function visible(element: HTMLElement, inViewport = true) {
  if (!element.isConnected || !element.getClientRects().length) return false
  for (let node: HTMLElement | null = element; node; node = node.parentElement) {
    const style = getComputedStyle(node)
    if (node.inert || style.display === 'none' || style.visibility === 'hidden' || Number(style.opacity) === 0) return false
  }
  const box = element.getBoundingClientRect()
  return box.width > 0 && box.height > 0 && (!inViewport || box.bottom > 0 && box.top < window.innerHeight)
}

export function ProjectOverlay({ data, projectId, onClose }: {
  data: PortfolioData
  projectId: string | null
  onClose: () => void
}) {
  const project = data.projects.find(({ id }) => id === projectId)
  return <AnimatePresence mode="wait">
    {project ? <ProjectSheet key={project.id} data={data} project={project} onClose={onClose} /> : null}
  </AnimatePresence>
}

function ProjectSheet({ data, project, onClose }: {
  data: PortfolioData
  project: PortfolioProject
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const prefix = useId()
  const close = useEffectEvent(onClose)
  const titleId = `${prefix}-title`
  const summaryId = `${prefix}-summary`
  const detailsId = `${prefix}-details`
  // Existing labels are the language signal; no storage or independent language state.
  const closeLabel = data.ui.language === 'Ngôn ngữ' ? 'Đóng dự án' : 'Close project'

  useLayoutEffect(() => {
    const root = rootRef.current!
    const dialog = dialogRef.current!
    // Engine owns this one slot, its parent R.overlay, and grandparent R.dev.
    const slot = root.closest<HTMLElement>('[data-ff-screen-overlay]')
    const device = slot?.parentElement?.parentElement
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null
    let frame = 0
    let attempts = 0
    let activated = false
    let release: (() => void) | undefined

    const activate = () => {
      if (activated || !slot || !device || !visible(slot) || !visible(root)) return
      const button = closeRef.current
      if (!button || !visible(button)) return
      const buttonBox = button.getBoundingClientRect(), slotBox = slot.getBoundingClientRect()
      if (buttonBox.top < slotBox.top || buttonBox.bottom > slotBox.bottom) return
      activated = true
      const saved: [HTMLElement, boolean][] = []
      // Inert sibling branches only: never the slot, R.overlay, R.dev or our own ancestors.
      for (let branch: HTMLElement = slot; branch !== device && branch.parentElement; branch = branch.parentElement) {
        for (const sibling of branch.parentElement.children) {
          if (sibling instanceof HTMLElement && sibling !== branch) {
            saved.push([sibling, sibling.inert])
            sibling.inert = true
          }
        }
      }
      const bodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      const controls = () => Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(node => visible(node, false))
      const focusFirst = () => (closeRef.current ?? dialog).focus({ preventScroll: true })
      const keydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          event.preventDefault()
          event.stopPropagation()
          close()
        } else if (event.key === 'Tab') {
          const items = controls()
          const index = items.indexOf(document.activeElement as HTMLElement)
          const next = items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length] ?? dialog
          event.preventDefault()
          next.focus({ preventScroll: true })
          const scroll = next.closest<HTMLElement>('[data-project-scroll]')
          if (scroll) {
            const box = next.getBoundingClientRect(), bounds = scroll.getBoundingClientRect()
            if (box.top < bounds.top) scroll.scrollTop += box.top - bounds.top - 4
            else if (box.bottom > bounds.bottom) scroll.scrollTop += box.bottom - bounds.bottom + 4
          }
          event.stopPropagation()
        }
      }
      const focusin = (event: FocusEvent) => {
        if (!dialog.contains(event.target as Node)) focusFirst()
      }
      const scrollerFor = (target: EventTarget | null) => target instanceof Element
        ? target.closest<HTMLElement>('[data-project-scroll]') : null
      const canScroll = (target: EventTarget | null, delta: number) => {
        const scroller = scrollerFor(target)
        return scroller && dialog.contains(scroller) && (delta < 0
          ? scroller.scrollTop > 0 : scroller.scrollTop + scroller.clientHeight < scroller.scrollHeight - 1)
      }
      const wheel = (event: WheelEvent) => {
        if (!canScroll(event.target, event.deltaY) || event.deltaX && !event.deltaY) event.preventDefault()
        event.stopPropagation()
      }
      let lastY = 0
      const touchstart = (event: TouchEvent) => { lastY = event.touches[0]?.clientY ?? 0 }
      const touchmove = (event: TouchEvent) => {
        const nextY = event.touches[0]?.clientY ?? lastY
        if (!canScroll(event.target, lastY - nextY)) event.preventDefault()
        lastY = nextY
        event.stopPropagation()
      }
      document.addEventListener('keydown', keydown, true)
      document.addEventListener('focusin', focusin, true)
      document.addEventListener('wheel', wheel, { capture: true, passive: false })
      document.addEventListener('touchstart', touchstart, { capture: true, passive: true })
      document.addEventListener('touchmove', touchmove, { capture: true, passive: false })
      focusFirst()
      release = () => {
        document.removeEventListener('keydown', keydown, true)
        document.removeEventListener('focusin', focusin, true)
        document.removeEventListener('wheel', wheel, true)
        document.removeEventListener('touchstart', touchstart, true)
        document.removeEventListener('touchmove', touchmove, true)
        for (const [node, inert] of saved) node.inert = inert
        document.body.style.overflow = bodyOverflow
      }
    }
    const waitForFlat = () => {
      activate()
      // Bounded initial wait; the observer handles a later engine visibility change.
      if (!activated && ++attempts < 600) frame = requestAnimationFrame(waitForFlat)
    }
    const observer = new MutationObserver(() => {
      if (activated && slot && !visible(slot)) {
        release?.()
        release = undefined
        activated = false
      }
      activate()
    })
    if (slot) observer.observe(slot, { attributes: true, attributeFilter: ['style', 'inert', 'aria-hidden'] })
    waitForFlat()
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      release?.()
      if (trigger && trigger !== document.body && trigger !== document.documentElement && visible(trigger)) trigger.focus({ preventScroll: true })
      else if (device) {
        const fallback = Array.from(device.querySelectorAll<HTMLElement>(
          `[data-ff-section="project-${CSS.escape(project.id)}"] button, .portfolio-nav button[data-portfolio-destination="projects"]`
        )).find(node => visible(node)) ?? Array.from(device.querySelectorAll<HTMLElement>('[data-portfolio-view]')).find(node => visible(node))
        fallback?.focus({ preventScroll: true })
      }
    }
  }, [project.id])

  return <motion.div ref={rootRef} className="project-overlay" data-project-overlay=""
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: EASE_OUT }}>
    <div className="project-overlay__backdrop" onClick={onClose} aria-hidden="true" />
    <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} aria-describedby={summaryId}
      tabIndex={-1} className="project-overlay__sheet" data-expanded={expanded}
      initial={{ y: '100%' }} animate={{ y: 0, height: expanded ? 'calc(100% - 64px)' : '240px' }}
      exit={{ y: '100%' }} transition={{ duration: 0.4, ease: EASE_OUT }}>
      <div className="project-overlay__handle" aria-hidden="true"><span /></div>
      <div className="project-overlay__scroll" data-project-scroll="">
        <header className="project-overlay__header">
          <div><h2 id={titleId}>{project.title}</h2><p className="project-overlay__meta">{project.year} · {project.category}</p></div>
          <button ref={closeRef} type="button" className="project-overlay__close" onClick={onClose} aria-label={closeLabel}>
            <Icon name="plus" size={20} style={{ transform: 'rotate(45deg)' }} />
          </button>
        </header>
        <p id={summaryId} className="project-overlay__summary">{project.summary}</p>
        <button type="button" className="project-overlay__expand" aria-expanded={expanded} aria-controls={detailsId}
          onClick={event => {
            event.currentTarget.closest<HTMLElement>('[data-project-scroll]')?.scrollTo({ top: 0 })
            setExpanded(value => !value)
          }}>
          {expanded ? data.ui.less : data.ui.more}<Icon name={expanded ? 'minus' : 'plus'} size={16} />
        </button>
        <div id={detailsId} className="project-overlay__details" inert={!expanded} aria-hidden={!expanded}>
          {project.tagline ? <p>{project.tagline}</p> : null}
          <img className="project-overlay__image" src={project.image.src} alt={project.image.alt} width="960" height="600" />
          <p className="project-overlay__tech">{project.techStack.join(' / ')}</p>
          <ContentBlocks blocks={project.details} />
          <h3>{data.ui.role}</h3><ContentBlocks blocks={project.role} />
          <div className="project-overlay__links">
            {project.liveUrl ? <a href={project.liveUrl} target="_blank" rel="noreferrer">{data.ui.live}<Icon size={15} /></a> : null}
            {project.sourceCode ? <a href={project.sourceCode} target="_blank" rel="noreferrer">{data.ui.code}<Icon name="github" size={15} /></a> : null}
          </div>
          {project.images.length ? <section className="project-overlay__gallery" aria-label={data.ui.gallery}>
            <h3>{data.ui.gallery}</h3>
            {project.images.map((src, index) => <img key={src} src={src} alt={`${project.title} — ${index + 1}`} width="960" height="600" loading="lazy" />)}
          </section> : null}
        </div>
      </div>
    </motion.div>
  </motion.div>
}

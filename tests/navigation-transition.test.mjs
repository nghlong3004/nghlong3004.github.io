import assert from 'node:assert/strict'
import test from 'node:test'
import { takeSnapshot, releaseSnapshot, SNAP_ID } from '../src/features/foldfolio/engine/snapshots.ts'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { registerHooks } from 'node:module'

// Match Vite's extensionless TS import when exercising the real hook in Node.
const resolver = registerHooks({ resolve(specifier, context, next) {
  return next(['../lib/math', './useIsoLayoutEffect'].includes(specifier) && context.parentURL?.endsWith('/hooks/useAnimationLoop.ts')
    ? specifier + '.ts' : specifier, context)
} })
const { useAnimationLoop } = await import('../src/features/foldfolio/hooks/useAnimationLoop.ts')
resolver.deregister()

// Minimal DOM/timer fixture: no browser package is needed for snapshot ownership checks.
function fixture() {
  let now = 0, next = 0
  const timers = new Map(), frames = new Map()
  class Element {
    attrs = new Map()
    children = []
    style = {}
    isConnected = false
    constructor(tag = 'div') { this.tagName = tag }
    get id() { return this.getAttribute('id') || '' }
    set id(value) { this.setAttribute('id', value) }
    get attributes() { return [...this.attrs].map(([name, value]) => ({ name, value })) }
    getAttribute(name) { return this.attrs.get(name) ?? null }
    setAttribute(name, value) { this.attrs.set(name, value) }
    removeAttribute(name) { this.attrs.delete(name) }
    connect(value) { this.isConnected = value; this.children.forEach(c => c.connect(value)) }
    appendChild(child) { this.children.push(child); child.parent = this; child.connect(this.isConnected) }
    remove() { this.parent.children = this.parent.children.filter(c => c !== this); this.connect(false) }
    querySelectorAll(selector) {
      return this.children.flatMap(c => [c, ...c.querySelectorAll('*')])
        .filter(c => selector === '*' || c.tagName === selector)
    }
    getBoundingClientRect() { return { left: 0, top: 0, bottom: 900, width: 1440, height: 900 } }
    cloneNode() {
      const copy = new Element(this.tagName)
      copy.attrs = new Map(this.attrs); copy.style = { ...this.style }
      this.children.forEach(c => copy.appendChild(c.cloneNode(true)))
      return copy
    }
  }
  const document = new EventTarget()
  document.body = new Element(); document.body.connect(true)
  document.visibilityState = 'visible'
  document.createElement = () => new Element()
  document.getElementById = id => document.body.querySelectorAll('*').find(e => e.id === id) || null
  const window = new EventTarget()
  window.innerHeight = 900
  window.setTimeout = (fn, ms) => { const id = ++next; timers.set(id, { fn, due: now + ms }); return id }
  window.clearTimeout = id => timers.delete(id)
  window.requestAnimationFrame = fn => { const id = ++next; frames.set(id, fn); return id }
  window.cancelAnimationFrame = id => frames.delete(id)
  const stage = new Element(); document.body.appendChild(stage)
  const originals = { window: globalThis.window, document: globalThis.document, performance: globalThis.performance }
  Object.assign(globalThis, { window, document, performance: { now: () => now } })
  return {
    window, document, stage, Element, timers, frames,
    advance(ms) {
      now += ms
      for (const [id, timer] of [...timers]) if (timer.due <= now) { timers.delete(id); timer.fn() }
    },
    frame(ms) { now += ms; const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now)) },
    restore() { Object.assign(globalThis, originals) },
  }
}

function check(name, run) {
  test(name, () => { const f = fixture(); try { run(f) } finally { f.restore() } })
}

check('snapshot is inert/hidden; cloned IDs and SVG paints stay local without ARIA cross-wiring', f => {
  const paint = new f.Element('linearGradient'); paint.id = 'paint'
  const link = new f.Element('a'); link.id = 'panel'
  link.setAttribute('aria-controls', 'live-panel'); link.setAttribute('onclick', 'alert(1)')
  link.setAttribute('fill', 'url(#paint)'); link.setAttribute('href', '#paint')
  f.stage.appendChild(paint); f.stage.appendChild(link)
  const snap = takeSnapshot(f.stage, true)
  assert.equal(snap.inert, true); assert.equal(snap.getAttribute('aria-hidden'), 'true')
  const [clonedPaint, clonedLink] = snap.children[0].children
  assert.notEqual(clonedPaint.id, paint.id); assert.notEqual(clonedLink.id, link.id)
  assert.equal(clonedLink.getAttribute('fill'), `url(#${clonedPaint.id})`)
  assert.equal(clonedLink.getAttribute('href'), `#${clonedPaint.id}`)
  assert.equal(clonedLink.getAttribute('aria-controls'), null)
  assert.equal(clonedLink.getAttribute('onclick'), null)
})

check('replacement cancels old fallback/fade; late releases never remove the new snapshot', f => {
  const first = takeSnapshot(f.stage, true)
  releaseSnapshot(360, first); f.frame(180)
  assert.equal(first.style.opacity, '0.75')
  const second = takeSnapshot(f.stage, true)
  assert.equal(first.isConnected, false)
  assert.equal(f.frames.size, 0)
  releaseSnapshot(0, first)
  releaseSnapshot(360) // a delayed page-mount callback must not adopt a section snapshot
  assert.equal(second.__fading, undefined)
  f.advance(650)
  assert.equal(f.document.getElementById(SNAP_ID), second)
  releaseSnapshot(360, second); f.frame(360)
  assert.equal(second.isConnected, false)
  assert.equal(f.frames.size, 0); assert.equal(f.timers.size, 0)
})

check('a replaced page snapshot fallback cannot start fading a newer node', f => {
  takeSnapshot(f.stage); f.advance(1000)
  const newer = takeSnapshot(f.stage)
  f.advance(2000)
  assert.equal(newer.__fading, undefined)
  assert.equal(newer.isConnected, true)
  f.advance(1000); f.frame(400)
  assert.equal(newer.isConnected, false)
})

check('resize, hidden tab and explicit zero-duration cleanup remove active fades and timers', f => {
  let snap = takeSnapshot(f.stage, true); releaseSnapshot(360, snap)
  f.window.dispatchEvent(new Event('resize'))
  assert.equal(snap.isConnected, false)
  assert.equal(f.frames.size, 0); assert.equal(f.timers.size, 0)
  snap = takeSnapshot(f.stage, true); releaseSnapshot(360, snap)
  f.document.visibilityState = 'hidden'; f.document.dispatchEvent(new Event('visibilitychange'))
  assert.equal(snap.isConnected, false)
  assert.equal(f.frames.size, 0); assert.equal(f.timers.size, 0)
  f.document.visibilityState = 'visible'
  snap = takeSnapshot(f.stage, true); releaseSnapshot(360, snap); releaseSnapshot(0, snap)
  assert.equal(snap.isConnected, false)
  assert.equal(f.frames.size, 0); assert.equal(f.timers.size, 0)
})

check('legacy page adoption still fades; invisible stages do not create snapshots', f => {
  const snap = takeSnapshot(f.stage)
  releaseSnapshot(360); f.frame(360)
  assert.equal(snap.isConnected, false)
  f.stage.getBoundingClientRect = () => ({ bottom: -1, top: -901, width: 1440 })
  assert.equal(takeSnapshot(f.stage, true), undefined)
  assert.equal(f.document.getElementById(SNAP_ID), null)
})

check('page-exit cleanup during a section transition does not leave an orphan overlay', f => {
  const snap = takeSnapshot(f.stage, true)
  releaseSnapshot(360, snap)
  assert.equal(takeSnapshot(f.stage), undefined)
  assert.equal(snap.isConnected, false)
  assert.equal(f.document.getElementById(SNAP_ID), null)
  assert.equal(f.frames.size, 0); assert.equal(f.timers.size, 0)
})

check('reduced-motion still animates snapshots; hidden lifecycle clears an older overlay', f => {
  const previous = takeSnapshot(f.stage, true)
  f.window.matchMedia = () => ({ matches: true })
  const reduced = takeSnapshot(f.stage, true)
  assert.ok(reduced?.isConnected)
  assert.equal(previous.isConnected, false)
  f.document.visibilityState = 'hidden'
  assert.equal(takeSnapshot(f.stage), undefined)
  assert.equal(reduced.isConnected, false)
  assert.equal(f.document.getElementById(SNAP_ID), null)
  assert.equal(f.timers.size, 0)
})

check('the real animation hook jump works before any passive effect has run', f => {
  const calls = []
  f.window.scrollTo = options => calls.push(options)
  const captured = []
  function Probe({ capture }) { capture(useAnimationLoop({ motion: { smoothing: 0.12, float: false } })); return null }
  // Server rendering creates the actual hook ref without executing its passive effect.
  renderToString(createElement(Probe, { capture: jump => captured.push(jump) }))
  captured[0].current(640)
  assert.deepEqual(calls, [{ top: 640, behavior: 'instant' }])
})

// Run the real loop at React's effect boundary without a browser dependency.
const moduleSource = source => 'data:text/javascript,' + encodeURIComponent(source)
const loopBridges = {
  react: moduleSource('export const useRef=v=>({current:v});export const useEffect=f=>globalThis.__loopEffects.passive.push(f)'),
  './useIsoLayoutEffect': moduleSource('export const useIsoLayoutEffect=f=>globalThis.__loopEffects.layout.push(f)'),
}
const loopResolver = registerHooks({ resolve(specifier, context, next) {
  if (context.parentURL?.includes('/hooks/useAnimationLoop.ts?lifecycle')) {
    return next(loopBridges[specifier] || (specifier === '../lib/math' ? specifier + '.ts' : specifier), context)
  }
  return next(specifier, context)
} })
const { useAnimationLoop: runLoop } = await import('../src/features/foldfolio/hooks/useAnimationLoop.ts?lifecycle')
loopResolver.deregister()

test('reload draws retained scroll before paint; StrictMode replay has one loop and ordinary smoothing', () => {
  const original = { window: globalThis.window, document: globalThis.document, __loopEffects: globalThis.__loopEffects }
  const frames = new Map(), timers = new Map(), renders = [], listeners = new Set()
  let next = 0
  class Target extends EventTarget {
    addEventListener(type, fn, options) { listeners.add(fn); super.addEventListener(type, fn, options) }
    removeEventListener(type, fn, options) { listeners.delete(fn); super.removeEventListener(type, fn, options) }
  }
  const window = new Target(), document = new Target()
  Object.assign(window, { scrollY: 650,
    scrollTo: ({ top }) => { window.scrollY = top },
    requestAnimationFrame: fn => { const id = ++next; frames.set(id, fn); return id },
    cancelAnimationFrame: id => frames.delete(id),
    setTimeout: fn => { const id = ++next; timers.set(id, fn); return id },
    clearTimeout: id => timers.delete(id),
  })
  document.visibilityState = 'visible'
  const effects = { layout: [], passive: [] }, live = { current: { cur: 0, k: 0 } }, kick = { current: () => {} }
  Object.assign(globalThis, { window, document, __loopEffects: effects })
  try {
    runLoop({ rootRef: { current: { getBoundingClientRect: () => ({ top: -window.scrollY, left: 0, width: 1440 }) } }, topRef: { current: 0 },
      R: { rig: { current: { style: {} } } }, isCanvas: false, geo: { current: { scene: 'glow', mode: 'fold' } }, preview: 0,
      reveals: { current: [] }, fadeIn: { current: 0 }, motion: { smoothing: .12, float: false }, live, kick,
      renderFrame: { current: cur => renders.push(cur) }, stepReveals: () => false })
    assert.equal(effects.layout.length, 1, 'initial scroll alignment must precede the first paint')
    assert.equal(effects.passive.length, 0)
    const setup = effects.layout[0]
    let cleanup = setup()
    assert.equal(renders.at(-1), 650)
    cleanup()
    assert.equal(frames.size, 0); assert.equal(timers.size, 0); assert.equal(listeners.size, 0)
    cleanup = setup() // StrictMode setup → cleanup → setup
    assert.equal(renders.at(-1), 650); assert.equal(frames.size, 1)
    window.scrollY = 850
    window.dispatchEvent(new Event('scroll'))
    const callbacks = [...frames.values()]; frames.clear(); callbacks.forEach(fn => fn(performance.now() + 16))
    assert.ok(live.current.cur > 650 && live.current.cur < 850, 'real scrolling must still smooth')
    document.visibilityState = 'hidden'; document.dispatchEvent(new Event('visibilitychange'))
    assert.equal(live.current.cur, 850)
    cleanup()
    assert.equal(frames.size, 0); assert.equal(timers.size, 0); assert.equal(listeners.size, 0)
    const stopped = renders.length
    window.dispatchEvent(new Event('scroll')); document.dispatchEvent(new Event('visibilitychange'))
    assert.equal(renders.length, stopped)
  } finally { Object.assign(globalThis, original) }
})

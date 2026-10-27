import assert from 'node:assert/strict'
import test from 'node:test'
import { registerHooks } from 'node:module'

const resolver = registerHooks({ resolve(specifier, context, next) {
  if (specifier === 'react') return next('data:text/javascript,export const useRef=value=>globalThis.__motionHooks.ref(value); export const useLayoutEffect=effect=>globalThis.__motionHooks.effect(effect); export const useEffect=useLayoutEffect', context)
  if (specifier === 'gsap') return next('data:text/javascript,export const gsap=globalThis.__motionGSAP', context)
  if (context.parentURL?.endsWith('/hooks/useScreenMotion.ts') && ['../lib/math', '../lib/colors'].includes(specifier)) return next(specifier + '.ts', context)
  if (context.parentURL?.endsWith('/hooks/useScreenMotion.ts') && ['./useIsoLayoutEffect', '../engine/compositionMotion'].includes(specifier)) return next(specifier + '.ts', context)
  if (context.parentURL?.endsWith('/lib/colors.ts') && specifier === '../config/constants') return next(specifier + '.ts', context)
  return next(specifier, context)
} })
const original = { window: globalThis.window, document: globalThis.document, performance: globalThis.performance, NodeFilter: globalThis.NodeFilter }
globalThis.window = {}
globalThis.__motionGSAP = { reverts: 0, timelineReverts: 0, tweens: [],
  context: fn => { fn(); return { add(callback) { callback() }, revert() { globalThis.__motionGSAP.reverts++ } } },
  timeline: () => ({ fromTo(el, from, to) { globalThis.__motionGSAP.tweens.push({ el, from, to }); return this },
    to(target, vars) { this.target = target; this.vars = vars; return this },
    time(value) { if (value === undefined) return this.position || 0; this.position = value; if (this.target) this.target.value = this.vars.ease(Math.min(value / this.vars.duration, 1)); return this },
    duration() { return this.vars?.duration || 1 }, revert() { globalThis.__motionGSAP.timelineReverts++ } }) }
const { useScreenMotion } = await import('../src/features/foldfolio/hooks/useScreenMotion.ts')
resolver.deregister()

function useFixture(count = 2, withComposition = false, withDeepCounter = false, copyCount = 1, visibleGroups = 1, entryToken = null, entryClip = '', port = false, inner = 0, metricTop = 900) {
  globalThis.__motionGSAP.reverts = 0; globalThis.__motionGSAP.timelineReverts = 0; globalThis.__motionGSAP.tweens = []
  const clock = { now: 0 }
  let next = 0, writes = 0, slot = 0, nowReads = 0
  const refs = [], effects = [], timers = new Map(), frames = new Map()
  Object.assign(globalThis, { __motionHooks: {
    ref(value) { return refs[slot++] ||= { current: value } },
    effect(callback) { effects.push(callback) },
  } })
  const schedule = (map, callback, delay) => { const id = ++next; map.set(id, { callback, at: clock.now + delay }); return id }
  const window = {
    setTimeout: (callback, delay) => schedule(timers, callback, delay),
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame: callback => schedule(frames, callback, 16),
    cancelAnimationFrame: id => frames.delete(id),
    getComputedStyle: el => el,
  }
  const nodes = Array.from({ length: count }, (_, i) => ({ nodeValue: i ? '140+' : '12' }))
  const elements = nodes.map(node => {
    const style = new Proxy({ removeProperty() { writes++ } }, { set(target, key, value) { writes++; target[key] = value; return true } })
    return { node, style, isConnected: true, offsetTop: 0, offsetHeight: 100,
      classList: { add() {}, remove() {} }, querySelector: () => null, contains: target => target === node }
  })
  const copies = Array.from({ length: copyCount }, () => {
    const metric = { isConnected: true, offsetTop: metricTop, offsetHeight: 100, style: { removeProperty() {} }, node: { nodeValue: '12' }, contains() { return true }, querySelector: () => null, classList: { add() {}, remove() {} } }
    const group = { isConnected: true, offsetTop: 0, offsetHeight: withDeepCounter ? 1200 : 300, style: { removeProperty() {} }, children: [], tagName: 'HEADER', querySelectorAll: () => withDeepCounter ? [metric] : [] }
    const visible = Array.from({ length: visibleGroups - 1 }, (_, i) => ({ isConnected: true, offsetTop: (i + 1) * 300, offsetHeight: 300, style: { removeProperty() {} }, children: [], tagName: 'SECTION', querySelectorAll: () => [] }))
    const laterGroup = { isConnected: true, offsetTop: 900, offsetHeight: 300, style: { removeProperty() {} }, children: [], tagName: 'SECTION', querySelectorAll: () => [] }
    const composition = { isConnected: true, offsetWidth: 976, offsetHeight: 1600,
      style: { clipPath: entryClip, getPropertyValue(name) { return name === 'clip-path' ? this.clipPath : '' }, getPropertyPriority() { return '' },
        setProperty(name, value) { if (name === 'clip-path') this.clipPath = value }, removeProperty(name) { if (name === 'clip-path') this.clipPath = '' } },
      getAttribute(name) { return name === 'data-ff-motion-entry' ? entryToken : null },
      children: [group, ...visible, laterGroup], tagName: 'DIV', querySelectorAll: () => [] }
    const main = { isConnected: true, offsetWidth: 976, clientWidth: 976, firstElementChild: null,
      contains(el) { return el === composition || composition.children.includes(el) },
      querySelectorAll(selector) {
        if (withComposition && selector.includes('data-ff-motion')) return [composition]
        return selector.includes('data-framer-name^=') && !withComposition ? elements : []
      } }
    metric.offsetParent = group
    composition.offsetParent = main; group.offsetParent = main; laterGroup.offsetParent = main
    for (const el of visible) el.offsetParent = main
    return { main, group, visible, metric, laterGroup, composition }
  })
  const { main, group, metric, laterGroup, composition } = copies[0]
  for (const el of elements) el.offsetParent = main
  const document = { visibilityState: 'visible', createTreeWalker(el) { let first = true; return {
    nextNode() { if (!first) return false; first = false; return true }, currentNode: el.node,
  } } }
  Object.assign(globalThis, { window, document, performance: { now: () => clock.now + (copyCount > 1 ? ++nowReads : 0) }, NodeFilter: { SHOW_TEXT: 4 } })
  const noop = () => {}
  const geo = { current: { Hs: port ? 718 : 660, port } }
  const motion = useScreenMotion({ isCanvas: false,
    R: { cL: { current: copyCount > 1 ? copies[0].main : null }, cR: { current: copyCount > 1 ? copies[1].main : main }, cOpen: { current: null }, cInteractive: { current: copies[2]?.main || null } },
    autoImgs: { current: [] }, measureSat: noop, measureLum: noop, paintScenes: { current: noop },
    screenColor: '#fff', tintMap: { current: [] }, rootRef: { current: null }, topRef: { current: 0 },
    motionOn: true, mo: { counters: true, hover: false, images: false, headlines: false, stagger: 0.2, duration: 1, distance: 20 },
    kick: { current: noop }, live: { current: { inner, pe: 1 } }, geo,
  })
  const cleanups = effects.map(effect => effect()).filter(Boolean)
  const fire = (map, id, at) => { clock.now = at; const item = map.get(id); assert.ok(item); map.delete(id); item.callback(clock.now) }
  return { motion, geo, elements, group, metric, laterGroup, composition, copies, timers, frames, cleanups, effects,
    get nowReads() { return nowReads }, setNow(value) { clock.now = value },
    fireTimer(id, at) { fire(timers, id, at) }, fireFrame(id, at) { fire(frames, id, at) },
    get writes() { return writes },
    get counters() { return refs.find(ref => ref.current instanceof Map).current },
    cleanup() { for (const fn of cleanups) fn() },
    replay() { for (const effect of effects) effect() },
    restore() { Object.assign(globalThis, original); delete globalThis.__motionHooks },
  }
}

test('opt-in composition enters as a group, later sections wait, and cleanup releases it', () => {
  const f = useFixture(0, true)
  try {
    f.motion.scan.current()
    assert.equal(f.motion.reveals.current.length, 1, 'visible ordinary composition enters together')
    assert.equal(f.motion.reveals.current[0].el, f.group)
    assert.ok(!f.motion.reveals.current.some(reveal => reveal.el === f.laterGroup))
    f.cleanup()
    assert.equal(f.motion.reveals.current.length, 0)
    f.replay()
    f.motion.scan.current()
    assert.equal(f.motion.reveals.current.length, 1, 'StrictMode replay rearms motion')
  } finally { f.cleanup(); f.restore() }
})

test('portrait entry tracks the visible content offset and settles when hidden', () => {
  const f = useFixture(0, true, false, 1, 1, '9', '', true, 300)
  try {
    f.motion.armEntry.current()
    assert.equal(f.composition.style.clipPath, 'inset(659px 0px 941px 0px)')
    f.motion.stepReveals(500)
    assert.equal(f.composition.style.clipPath, 'inset(344.875px 0px 626.875px 0px)')
    globalThis.document.visibilityState = 'hidden'
    f.motion.stepReveals(600)
    assert.equal(f.composition.style.clipPath, '')
    f.motion.armEntry.current()
    assert.equal(f.composition.style.clipPath, '', 'consumed token does not replay after hidden settle')
  } finally { f.cleanup(); f.restore() }
})

test('orientation change settles the old mask without replaying the same token', () => {
  const f = useFixture(0, true, false, 1, 1, '10')
  try {
    f.motion.armEntry.current()
    f.geo.current.port = true
    f.motion.stepReveals(100)
    assert.equal(f.composition.style.clipPath, '')
    f.motion.armEntry.current()
    assert.equal(f.composition.style.clipPath, '')
  } finally { f.cleanup(); f.restore() }
})

test('two visible groups in canonical and decorative copies start from one tick, while later groups wait', () => {
  const f = useFixture(0, true, false, 3, 2)
  try {
    f.motion.scan.current()
    const initial = f.motion.reveals.current
    assert.equal(initial.length, 6, 'two visible groups in each of three copies')
    assert.equal(new Set(initial.map(reveal => reveal.t0)).size, 1, 'all initially visible groups share a start')
    assert.equal(f.nowReads, 1, 'one clock capture for the initial tick')
    for (const copy of f.copies) {
      assert.ok(initial.some(reveal => reveal.el === copy.group))
      assert.ok(initial.some(reveal => reveal.el === copy.visible[0]))
      assert.ok(!initial.some(reveal => reveal.el === copy.laterGroup))
    }
    const firstStart = initial[0].t0
    f.setNow(1000)
    f.motion.motionTick.current(900, 1)
    const later = f.motion.reveals.current.filter(reveal => f.copies.some(copy => reveal.el === copy.laterGroup))
    assert.equal(later.length, 3)
    assert.equal(new Set(later.map(reveal => reveal.t0)).size, 1, 'later copies share their new viewport-entry tick')
    assert.ok(later[0].t0 > firstStart, 'later content does not reveal at initial navigation')
    assert.equal(f.nowReads, 2)
  } finally { f.cleanup(); f.restore() }
})

test('entry mask style endpoints share one aperture and retain a full-root clip while visible', () => {
  const f = useFixture(0, true, false, 3, 2, '7')
  try {
    f.motion.armEntry.current()
    assert.deepEqual(f.copies.map(copy => copy.composition.style.clipPath), Array(3).fill('inset(0px 488px 0px 488px)'))
    f.motion.scan.current()
    assert.ok(!f.motion.reveals.current.some(reveal => f.copies.some(copy => reveal.el === copy.group || reveal.el === copy.visible[0])))
    f.motion.stepReveals(500)
    const masks = f.copies.map(copy => copy.composition.style.clipPath)
    assert.equal(new Set(masks).size, 1, 'canonical and decorative masks share progress')
    assert.match(masks[0], /^inset\(0px (?!488|0)\d+(?:\.\d+)?px 0px \d+(?:\.\d+)?px\)$/)
    f.motion.stepReveals(1001)
    assert.deepEqual(f.copies.map(copy => copy.composition.style.clipPath), Array(3).fill('inset(0px)'), 'full-root clip remains explicit at the endpoint')
    f.motion.stepReveals(1017)
    assert.deepEqual(f.copies.map(copy => copy.composition.style.clipPath), Array(3).fill('inset(0px)'), 'settled live composition does not remove its painting clip')
    f.cleanup()
    assert.deepEqual(f.copies.map(copy => copy.composition.style.clipPath), ['', '', ''], 'unmount restores owned clips')
  } finally { f.cleanup(); f.restore() }
})

test('an initially visible nested counter counts during aperture without a group rise', () => {
  const f = useFixture(0, true, true, 1, 1, '11', '', false, 0, 100)
  try {
    f.motion.armEntry.current()
    f.motion.scan.current()
    assert.ok(!f.motion.reveals.current.some(reveal => reveal.el === f.group || reveal.el === f.metric))
    assert.equal(f.timers.size, 1, 'visible counter is registered despite group-rise suppression')
    f.fireTimer([...f.timers.keys()][0], 150)
    assert.equal(f.metric.node.nodeValue, '0', 'the real counter text begins count-up')
    assert.equal(f.frames.size, 1)
  } finally { f.cleanup(); f.restore() }
})

for (const port of [false, true]) test(`entry never seeks backwards on interleaved sync/rAF clocks (${port ? 'portrait' : 'landscape'})`, () => {
  const f = useFixture(0, true, false, 3, 1, 'clock', '', port, port ? 300 : 0)
  try {
    f.motion.armEntry.current() // performance.now() marker is 1ms in this fixture.
    f.motion.stepReveals(201) // A synchronous navigation jump advances the real paused timeline.
    const opened = f.copies.map(copy => copy.composition.style.clipPath)
    assert.deepEqual(opened, Array(3).fill(port
      ? 'inset(483.80800000000005px 0px 765.808px 0px)'
      : 'inset(0px 249.85600000000005px 0px 249.85600000000005px)'))
    f.motion.stepReveals(0) // An already-scheduled rAF timestamp can precede the marker.
    assert.deepEqual(f.copies.map(copy => copy.composition.style.clipPath), opened, 'older frame cannot close the opened band')
    f.motion.stepReveals(101)
    f.motion.stepReveals(201)
    assert.deepEqual(f.copies.map(copy => copy.composition.style.clipPath), opened, 'backwards and equal clock samples hold progress')
    f.motion.stepReveals(501)
    assert.deepEqual(f.copies.map(copy => copy.composition.style.clipPath), Array(3).fill(port
      ? 'inset(344.875px 0px 626.875px 0px)'
      : 'inset(0px 61px 0px 61px)'))
    f.motion.stepReveals(1001)
    assert.equal(f.motion.stepReveals(10), false, 'settled entry does not request idle playback')
    assert.deepEqual(f.copies.map(copy => copy.composition.style.clipPath), Array(3).fill('inset(0px)'), 'settled entry stays full-root')
  } finally { f.cleanup(); f.restore() }
})

test('scroll into a later group during aperture defers its rise until entry settles', () => {
  const f = useFixture(0, true, false, 1, 1, '12')
  try {
    f.motion.armEntry.current()
    f.motion.scan.current()
    f.motion.motionTick.current(900, 1)
    assert.ok(!f.motion.reveals.current.some(reveal => reveal.el === f.laterGroup), 'scroll cannot start a competing group rise')
    f.motion.stepReveals(1001)
    f.motion.stepReveals(1017)
    f.motion.motionTick.current(900, 1)
    assert.ok(f.motion.reveals.current.some(reveal => reveal.el === f.laterGroup), 'later-section rise remains available after aperture')
  } finally { f.cleanup(); f.restore() }
})

test('entry cleanup restores preexisting clip and prevents detached or hidden writes', () => {
  const f = useFixture(0, true, false, 1, 1, '8', 'circle(40%)')
  try {
    f.motion.armEntry.current()
    f.cleanup()
    assert.equal(f.composition.style.clipPath, 'circle(40%)', 'initial owned mask is released on unmount')
    f.replay()
    f.motion.armEntry.current()
    assert.equal(f.composition.style.clipPath, 'inset(0px 488px 0px 488px)')
    f.composition.isConnected = false
    f.motion.stepReveals(500)
    assert.equal(f.composition.style.clipPath, 'circle(40%)', 'detached screen is not left masked')
  } finally { f.cleanup(); f.restore() }
})

test('composition timelines use the engine cubic ease at quarter, half and three-quarter progress', () => {
  const f = useFixture(0, true)
  try {
    f.motion.scan.current()
    const ease = globalThis.__motionGSAP.tweens[0]?.to.ease
    assert.equal(typeof ease, 'function', 'GSAP receives the engine easing function')
    assert.deepEqual([0.25, 0.5, 0.75].map(ease), [0.578125, 0.875, 0.984375])
  } finally { f.cleanup(); f.restore() }
})

test('detached composition releases its GSAP context before a replacement scan', () => {
  const f = useFixture(0, true)
  try {
    f.motion.scan.current()
    f.composition.isConnected = false; f.group.isConnected = false
    f.motion.stepReveals(300)
    assert.equal(globalThis.__motionGSAP.reverts, 1)
    assert.equal(f.motion.reveals.current.length, 0)
  } finally { f.cleanup(); f.restore() }
})

test('a counter deep inside an entered composition waits for its own viewport entry', () => {
  const f = useFixture(0, true, true)
  try {
    f.motion.scan.current()
    assert.equal(f.timers.size, 0, 'offscreen metric must not count with its section header')
    f.motion.motionTick.current(900, 1)
    assert.equal(f.timers.size, 1)
    assert.ok(!f.motion.reveals.current.some(reveal => reveal.el === f.metric), 'counter text has no competing opacity/transform reveal')
  } finally { f.cleanup(); f.restore() }
})

test('detaching a composition cancels its pending counter callback', () => {
  const f = useFixture(0, true, true)
  try {
    f.motion.scan.current()
    f.motion.motionTick.current(900, 1)
    assert.equal(f.timers.size, 1)
    f.composition.isConnected = false; f.group.isConnected = false; f.metric.isConnected = false
    f.motion.stepReveals(300)
    assert.equal(f.timers.size, 0)
  } finally { f.cleanup(); f.restore() }
})

test('unmount cancels staggered counters before they touch either text node', () => {
  const f = useFixture()
  try {
    f.motion.scan.current()
    assert.equal(f.timers.size, 2)
    f.cleanup()
    assert.equal(f.timers.size, 0)
    assert.equal(f.frames.size, 0)
    assert.deepEqual(f.elements.map(el => el.node.nodeValue), ['12', '140+'])
  } finally { f.restore() }
})

test('unmount cancels an active counter frame, safety timeout and reveal hover reset', () => {
  const f = useFixture(1)
  try {
    f.motion.scan.current()
    f.fireTimer([...f.timers.keys()][0], 150)
    f.fireFrame([...f.frames.keys()][0], 166)
    assert.notEqual(f.elements[0].node.nodeValue, '12')
    f.motion.stepReveals(5000)
    assert.equal(f.timers.size, 2, 'safety and 80 ms transition reset')
    f.cleanup()
    const writes = f.writes
    assert.equal(f.elements[0].node.nodeValue, '12')
    assert.equal(f.timers.size, 0)
    assert.equal(f.frames.size, 0)
    f.motion.stepReveals(6000)
    assert.equal(f.writes, writes)
  } finally { f.restore() }
})

test('detached view is never written; StrictMode replay rescans and counts again', () => {
  const f = useFixture(1)
  try {
    f.motion.scan.current()
    f.elements[0].isConnected = false
    const writes = f.writes
    f.fireTimer([...f.timers.keys()][0], 150)
    assert.equal(f.frames.size, 0)
    f.motion.stepReveals(5000)
    assert.equal(f.writes, writes)
    f.cleanup()
    f.elements[0].isConnected = true
    f.replay()
    f.motion.scan.current()
    assert.equal(f.timers.size, 1)
    f.fireTimer([...f.timers.keys()][0], 300)
    assert.equal(f.frames.size, 1)
  } finally { f.restore() }
})

test('detaching an active view releases retained counter targets before device unmount', () => {
  const f = useFixture(1)
  try {
    f.motion.scan.current()
    f.fireTimer([...f.timers.keys()][0], 150)
    assert.equal(f.counters.size, 1)
    f.elements[0].isConnected = false
    const text = f.elements[0].node.nodeValue
    f.fireFrame([...f.frames.keys()][0], 166)
    assert.equal(f.counters.size, 0)
    assert.equal(f.elements[0].node.nodeValue, text)
    f.cleanup()
    assert.equal(f.timers.size, 0)
  } finally { f.restore() }
})

test('live stagger, counter completion and delayed transition reset retain their timings', () => {
  const f = useFixture()
  try {
    f.motion.scan.current()
    assert.deepEqual([...f.timers.values()].map(timer => timer.at), [150, 350])
    f.fireTimer([...f.timers.keys()][0], 150)
    assert.equal(f.elements[0].node.nodeValue, '0')
    f.fireFrame([...f.frames.keys()][0], 2000)
    assert.equal(f.elements[0].node.nodeValue, '12')
    const safety = [...f.timers.entries()].find(([, timer]) => timer.at > 1000)
    assert.ok(safety)
    f.fireTimer(safety[0], safety[1].at)
    assert.equal(f.elements[0].node.nodeValue, '12')
    f.motion.stepReveals(5000)
    assert.equal([...f.timers.values()].filter(timer => timer.at === safety[1].at + 80).length, 2)
  } finally { f.cleanup(); f.restore() }
})

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
  context: () => ({ add(fn) { fn() }, revert() { globalThis.__motionGSAP.reverts++ } }),
  timeline: () => ({ fromTo(el, from, to) { globalThis.__motionGSAP.tweens.push({ el, from, to }); return this }, time() { return this }, duration() { return 1 }, revert() { globalThis.__motionGSAP.timelineReverts++ } }) }
const { useScreenMotion } = await import('../src/features/foldfolio/hooks/useScreenMotion.ts')
resolver.deregister()

function useFixture(count = 2, withComposition = false, withDeepCounter = false, copyCount = 1, visibleGroups = 1) {
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
    const metric = { isConnected: true, offsetTop: 900, offsetHeight: 100, style: { removeProperty() {} }, node: { nodeValue: '12' }, contains() { return true }, querySelector: () => null, classList: { add() {}, remove() {} } }
    const group = { isConnected: true, offsetTop: 0, offsetHeight: withDeepCounter ? 1200 : 300, style: { removeProperty() {} }, children: [], tagName: 'HEADER', querySelectorAll: () => withDeepCounter ? [metric] : [] }
    const visible = Array.from({ length: visibleGroups - 1 }, (_, i) => ({ isConnected: true, offsetTop: (i + 1) * 300, offsetHeight: 300, style: { removeProperty() {} }, children: [], tagName: 'SECTION', querySelectorAll: () => [] }))
    const laterGroup = { isConnected: true, offsetTop: 900, offsetHeight: 300, style: { removeProperty() {} }, children: [], tagName: 'SECTION', querySelectorAll: () => [] }
    const composition = { isConnected: true, children: [group, ...visible, laterGroup], tagName: 'DIV', querySelectorAll: () => [] }
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
  const document = { createTreeWalker(el) { let first = true; return {
    nextNode() { if (!first) return false; first = false; return true }, currentNode: el.node,
  } } }
  Object.assign(globalThis, { window, document, performance: { now: () => clock.now + (copyCount > 1 ? ++nowReads : 0) }, NodeFilter: { SHOW_TEXT: 4 } })
  const noop = () => {}
  const motion = useScreenMotion({ isCanvas: false,
    R: { cL: { current: copyCount > 1 ? copies[0].main : null }, cR: { current: copyCount > 1 ? copies[1].main : main }, cOpen: { current: null }, cInteractive: { current: copies[2]?.main || null } },
    autoImgs: { current: [] }, measureSat: noop, measureLum: noop, paintScenes: { current: noop },
    screenColor: '#fff', tintMap: { current: [] }, rootRef: { current: null }, topRef: { current: 0 },
    motionOn: true, mo: { counters: true, hover: false, images: false, headlines: false, stagger: 0.2, duration: 0.5, distance: 20 },
    kick: { current: noop }, live: { current: { inner: 0, pe: 1 } }, geo: { current: { Hs: 660, port: false } },
  })
  const cleanups = effects.map(effect => effect()).filter(Boolean)
  const fire = (map, id, at) => { clock.now = at; const item = map.get(id); assert.ok(item); map.delete(id); item.callback(clock.now) }
  return { motion, elements, group, metric, laterGroup, composition, copies, timers, frames, cleanups, effects,
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

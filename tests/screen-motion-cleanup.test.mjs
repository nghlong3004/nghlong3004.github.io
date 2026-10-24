import assert from 'node:assert/strict'
import test from 'node:test'
import { registerHooks } from 'node:module'

const resolver = registerHooks({ resolve(specifier, context, next) {
  if (specifier === 'react') return next('data:text/javascript,export const useRef=value=>globalThis.__motionHooks.ref(value); export const useLayoutEffect=effect=>globalThis.__motionHooks.effect(effect); export const useEffect=useLayoutEffect', context)
  if (context.parentURL?.endsWith('/hooks/useScreenMotion.ts') && ['../lib/math', '../lib/colors'].includes(specifier)) return next(specifier + '.ts', context)
  if (context.parentURL?.endsWith('/hooks/useScreenMotion.ts') && specifier === './useIsoLayoutEffect') return next(specifier + '.ts', context)
  if (context.parentURL?.endsWith('/lib/colors.ts') && specifier === '../config/constants') return next(specifier + '.ts', context)
  return next(specifier, context)
} })
const original = { window: globalThis.window, document: globalThis.document, performance: globalThis.performance, NodeFilter: globalThis.NodeFilter }
globalThis.window = {}
const { useScreenMotion } = await import('../src/features/foldfolio/hooks/useScreenMotion.ts')
resolver.deregister()

function useFixture(count = 2) {
  const clock = { now: 0 }
  let next = 0, writes = 0, slot = 0
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
  const main = { isConnected: true, offsetWidth: 976, clientWidth: 976, firstElementChild: null,
    querySelectorAll(selector) { return selector.includes('data-framer-name^=') ? elements : [] } }
  for (const el of elements) el.offsetParent = main
  const document = { createTreeWalker(el) { let first = true; return {
    nextNode() { if (!first) return false; first = false; return true }, currentNode: el.node,
  } } }
  Object.assign(globalThis, { window, document, performance: { now: () => clock.now }, NodeFilter: { SHOW_TEXT: 4 } })
  const noop = () => {}
  const motion = useScreenMotion({ isCanvas: false,
    R: { cL: { current: null }, cR: { current: main }, cOpen: { current: null } },
    autoImgs: { current: [] }, measureSat: noop, measureLum: noop, paintScenes: { current: noop },
    screenColor: '#fff', tintMap: { current: [] }, rootRef: { current: null }, topRef: { current: 0 },
    motionOn: true, mo: { counters: true, hover: false, images: false, headlines: false, stagger: 0.2, duration: 0.5, distance: 20 },
    kick: { current: noop }, live: { current: { inner: 0, pe: 1 } }, geo: { current: { Hs: 660, port: false } },
  })
  const cleanups = effects.map(effect => effect()).filter(Boolean)
  const fire = (map, id, at) => { clock.now = at; const item = map.get(id); assert.ok(item); map.delete(id); item.callback(clock.now) }
  return { motion, elements, timers, frames, cleanups, effects,
    fireTimer(id, at) { fire(timers, id, at) }, fireFrame(id, at) { fire(frames, id, at) },
    get writes() { return writes },
    get counters() { return refs.find(ref => ref.current instanceof Map).current },
    cleanup() { for (const fn of cleanups) fn() },
    replay() { for (const effect of effects) effect() },
    restore() { Object.assign(globalThis, original); delete globalThis.__motionHooks },
  }
}

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

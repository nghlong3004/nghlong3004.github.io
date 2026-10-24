import assert from 'node:assert/strict'
import test from 'node:test'
import { registerHooks } from 'node:module'

const data = source => 'data:text/javascript,' + encodeURIComponent(source)
const navBridge = {
  react: data('export const useRef=v=>globalThis.__endingFixture.ref(v);export const useImperativeHandle=()=>{}'),
  './useIsoLayoutEffect': data('export const useIsoLayoutEffect=f=>globalThis.__endingFixture.layout.push(f)'),
  '../engine/snapshots': data('export const takeSnapshot=()=>{};export const releaseSnapshot=()=>{}'),
}
const resolver = registerHooks({ resolve(specifier, context, next) {
  const parent = context.parentURL || ''
  if (parent.endsWith('/hooks/useSectionNavigation.ts') && navBridge[specifier])
    return next(navBridge[specifier], context)
  if (parent.endsWith('/hooks/useSectionNavigation.ts') && specifier === '../engine/navigation')
    return next(specifier + '.ts', context)
  if (parent.endsWith('/engine/createFrameRenderer.ts') && specifier === '../lib/math')
    return next(specifier + '.ts', context)
  if (parent.endsWith('/app/config/device.ts') && specifier === '../../features/portfolio/lib/vietnamTime')
    return next(specifier + '.ts', context)
  return next(specifier, context)
} })
const { deviceConfig } = await import('../src/app/config/device.ts')
const { createFrameRenderer } = await import('../src/features/foldfolio/engine/createFrameRenderer.ts')
const { getSectionScrollY } = await import('../src/features/foldfolio/engine/navigation.ts')
const { useScreenNavigationRequest } = await import('../src/features/foldfolio/hooks/useSectionNavigation.ts')
resolver.deregister()

const stageH = 900
const Hs = 660
const rootTop = 100
const openLength = stageH * deviceConfig.motion.openLength

function frameFixture(contentH, closeLength = deviceConfig.motion.closeLength, holdLength = deviceConfig.motion.holdLength) {
  const innerMax = Math.max(0, contentH - Hs)
  const g = { mode: 'fold', port: false, scene: 'none', G: { W: 1000, H: 684, f: 4, bz: 8 },
    s: .75, U1: openLength, U2: stageH * closeLength, U3: stageH * holdLength,
    innerMax, innerPx: innerMax * .75, Hs, halfH: Hs / 2, cRight: 'right', cAll: 'all', inner: value => value }
  const element = () => { const attrs = new Map(); return { style: {}, inert: false,
    getAttribute: key => attrs.get(key) ?? null, hasAttribute: key => attrs.has(key),
    setAttribute: (key, value) => attrs.set(key, value), removeAttribute: key => attrs.delete(key),
    contains: () => false } }
  const interactive = element(), call = element(), overlay = element()
  const refs = new Proxy({ cInteractive: { current: interactive }, call: { current: call },
    overlay: { current: overlay }, dev: { current: element() } },
  { get: (target, key) => target[key] || { current: null } })
  const live = { current: { k: -1, inner: -1, pe: 0, rc: '', tint: '', bars: null } }
  const ticks = []
  const frame = createFrameRenderer({ geo: { current: g }, motion: deviceConfig.motion, live,
    S(el, key, value) { if (el) el.style[key] = value }, R: refs,
    motionTick: { current: (...args) => ticks.push(args) }, sceneList: () => [],
    sat: { current: {} }, glowCur: { current: '' }, glowFlip: { current: 0 },
    drawGlow() {}, status: { tone: 'dark' }, tintMap: { current: [] },
    imgLum: { current: {} }, rootRef: { current: null } })
  return { frame, g, live, interactive, call, overlay, ticks }
}

test('app timeline unfolds then stays open at the end for short and long content', () => {
  assert.equal(deviceConfig.mode, 'fold')
  assert.ok(deviceConfig.motion.openLength > 0)
  assert.equal(deviceConfig.motion.closeLength, 0)
  assert.equal(deviceConfig.motion.holdLength, 0)
  for (const contentH of [480, 1660]) {
    const f = frameFixture(contentH)
    const end = f.g.U1 + f.g.innerPx + f.g.U2 + f.g.U3
    const totalH = stageH + end
    assert.equal(totalH - stageH, end, 'sticky stage reaches content end at page bottom')
    const oldDocument = globalThis.document
    globalThis.document = { activeElement: null }
    try {
      f.frame(0, 0)
      assert.equal(f.live.current.pe, 0, 'cover remains closed at entry')
      assert.equal(f.interactive.inert, true)
      f.frame(f.g.U1 / 2, 16)
      assert.ok(f.live.current.pe > 0 && f.live.current.pe < 1)
      f.frame(f.g.U1, 32)
      assert.equal(f.live.current.pe, 1)
      assert.equal(f.interactive.inert, false)
      f.frame(f.g.U1 + f.g.innerPx / 2, 48)
      assert.equal(f.live.current.pe, 1)
      assert.equal(f.live.current.inner, f.g.innerMax / 2)
      f.frame(end, 64)
      assert.equal(f.live.current.pe, 1)
      assert.equal(f.live.current.inner, f.g.innerMax)
      f.frame(end + stageH, 80)
      assert.equal(f.live.current.pe, 1, 'overscroll cannot enter a closing phase')
      assert.equal(f.live.current.inner, f.g.innerMax)
      assert.equal(f.interactive.inert, false)
      assert.notEqual(f.call.style.pointerEvents, 'auto')
      assert.equal(f.overlay.style.visibility, 'visible')
    } finally { globalThis.document = oldDocument }
  }
})

test('real section math reaches and clamps within the open content', () => {
  for (const contentH of [480, 1660]) {
    const { g } = frameFixture(contentH)
    assert.equal(getSectionScrollY(rootTop, 0, g), rootTop + g.U1)
    assert.equal(getSectionScrollY(rootTop, contentH + 1000, g), rootTop + g.U1 + g.innerPx)
    assert.equal(getSectionScrollY(rootTop, contentH + 1000, { ...g, s: .5 }), rootTop + g.U1 + g.innerMax * .5)
  }
})

test('real navigation remaps an open ending on resize and resets a new view without closing', () => {
  const old = { window: globalThis.window, document: globalThis.document, __endingFixture: globalThis.__endingFixture }
  let slot = 0, next = 0, cleanup
  const frames = new Map(), calls = [], focus = []
  const window = new EventTarget()
  Object.assign(window, { scrollY: 0,
    scrollTo(options) { calls.push(options); if (options.behavior === 'instant') this.scrollY = options.top },
    requestAnimationFrame(fn) { const id = ++next; frames.set(id, fn); return id },
    cancelAnimationFrame(id) { frames.delete(id) } })
  const document = { visibilityState: 'visible' }
  const screen = { querySelectorAll: () => [target] }
  const target = { dataset: { ffSection: 'view-root' }, offsetTop: 0, offsetParent: screen,
    isConnected: true, focus: options => focus.push(options) }
  const refs = [], bridge = { layout: [], ref(initial) { const i = slot++; return refs[i] ||= { current: initial } } }
  const geometry = { current: { ...frameFixture(1660).g, s: .5, innerMax: 1000, innerPx: 500 } }
  const live = { current: { pe: 1, cur: 0 } }
  const rootRef = { current: { getBoundingClientRect: () => ({ top: rootTop - window.scrollY }) } }
  const measureRef = { current: { offsetHeight: 1660 } }
  const deviceRefs = { cInteractive: { current: screen }, cR: { current: screen } }
  const jump = { current(top) { window.scrollTo({ top, behavior: 'instant' }); live.current.cur = top - rootTop; live.current.pe = 1 } }
  Object.assign(globalThis, { window, document, __endingFixture: bridge })
  function Probe(request) {
    useScreenNavigationRequest({ request, rootRef, measureRef, refs: deviceRefs, geometry, live,
      jump, cancelSection: { current() {} }, contentH: 1660, setContentH() {}, isCanvas: false })
  }
  const render = request => {
    cleanup?.(); slot = 0; bridge.layout = []
    Probe(request)
    cleanup = bridge.layout[0]?.()
  }
  const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()) }
  try {
    render({ key: 'home:1' }); flush()
    const firstEnd = rootTop + geometry.current.U1 + geometry.current.innerMax * geometry.current.s
    window.scrollY = firstEnd
    geometry.current.s = .8
    geometry.current.U1 = 800 * deviceConfig.motion.openLength
    render({ key: 'home:1' })
    const resizedEnd = rootTop + geometry.current.U1 + geometry.current.innerMax * geometry.current.s
    assert.equal(window.scrollY, resizedEnd)
    assert.deepEqual(calls.at(-1), { top: resizedEnd, behavior: 'instant' })
    render({ key: 'work:2' }); flush()
    assert.equal(window.scrollY, rootTop + geometry.current.U1)
    assert.equal(focus.length, 2)
    assert.equal(geometry.current.U2, 0)
    assert.equal(geometry.current.U3, 0)
  } finally {
    cleanup?.()
    Object.assign(globalThis, old)
  }
})

test('generic fold renderer still closes and exposes call with positive closing length', () => {
  const f = frameFixture(1660, 1.1, .4)
  const oldDocument = globalThis.document
  globalThis.document = { activeElement: null }
  try {
    f.frame(f.g.U1 + f.g.innerPx, 0)
    assert.equal(f.live.current.pe, 1)
    f.frame(f.g.U1 + f.g.innerPx + f.g.U2, 16)
    assert.equal(f.live.current.pe, 0)
    assert.equal(f.interactive.inert, true)
    assert.equal(f.call.style.pointerEvents, 'auto')
    assert.equal(f.call.style.opacity, '1')
    f.frame(f.g.U1 + f.g.innerPx + f.g.U2 + f.g.U3, 32)
    assert.equal(f.live.current.pe, 0)
  } finally { globalThis.document = oldDocument }
})

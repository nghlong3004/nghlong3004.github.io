import assert from 'node:assert/strict'
import test from 'node:test'
import { registerHooks } from 'node:module'

const data = source => 'data:text/javascript,' + encodeURIComponent(source)
const bridges = {
  react: data('export const useRef=v=>globalThis.__navFixture.ref(v);export const useEffect=()=>{};export const useImperativeHandle=()=>{}'),
  './useIsoLayoutEffect': data('export const useIsoLayoutEffect=f=>globalThis.__navFixture.layout.push(f)'),
  '../engine/navigation': data('export const getSectionScrollY=(root,top,g)=>root+(g.mode==="fold"?g.U1:0)+Math.max(0,Math.min(top-48,g.innerMax))*g.s'),
  '../engine/snapshots': data('export const takeSnapshot=()=>{};export const releaseSnapshot=()=>{}'),
}
const resolver = registerHooks({ resolve(specifier, context, next) {
  return next(context.parentURL?.endsWith('/hooks/useSectionNavigation.ts') && bridges[specifier]
    ? bridges[specifier] : specifier, context)
} })
const { useScreenNavigationRequest } = await import('../src/features/foldfolio/hooks/useSectionNavigation.ts')
resolver.deregister()

function fixture(mode = 'fold') {
  let next = 0, slot = 0, cleanup, contentH = 1000
  const frames = new Map(), calls = [], focus = []
  const target = (key, top) => ({ dataset: { ffSection: key }, offsetTop: top,
    isConnected: true, focus: options => focus.push({ key, options }) })
  const screen = { querySelectorAll: () => sections }
  const sections = [target('view-root', 0), target('project-one', 600)]
  sections.forEach(node => { node.offsetParent = screen })
  const window = new EventTarget()
  Object.assign(window, { scrollY: 0, scrollTo(options) { calls.push(options); if (options.behavior === 'instant') this.scrollY = options.top },
    requestAnimationFrame(fn) { const id = ++next; frames.set(id, fn); return id }, cancelAnimationFrame(id) { frames.delete(id) } })
  const document = { visibilityState: 'visible' }
  const original = { window: globalThis.window, document: globalThis.document, __navFixture: globalThis.__navFixture }
  const refs = [], f = { layout: [], ref(initial) { const i = slot++; return refs[i] ||= { current: initial } } }
  Object.assign(globalThis, { window, document, __navFixture: f })
  const rootTop = 100
  const rootRef = { current: { getBoundingClientRect: () => ({ top: rootTop - window.scrollY }) } }
  const measureRef = { current: { offsetHeight: contentH } }
  const geometry = { current: { mode, U1: 300, U2: 300, U3: 100,
    s: 0.5, Hs: 600, innerMax: contentH - 600 } }
  const live = { current: { pe: mode === 'open' ? 1 : 0, cur: 0 } }
  const refsDevice = { cR: { current: screen }, cOpen: { current: screen } }
  const jump = { current(top) { window.scrollTo({ top, behavior: 'instant' }); live.current.cur = top - rootTop; live.current.pe = 1 } }
  function Probe(request) {
    useScreenNavigationRequest({ request, rootRef, measureRef, refs: refsDevice, geometry, live,
      jump, cancelSection: { current: () => {} }, contentH, setContentH: h => { contentH = h }, isCanvas: false })
  }
  function render(request) {
    cleanup?.()
    slot = 0; f.layout = []
    Probe(request)
    cleanup = f.layout[0]?.()
  }
  function frame() { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()) }
  return { render, frame, window, geometry, live, measureRef, sections, calls, focus, frames,
    setContentHeight(h) { contentH = h; measureRef.current.offsetHeight = h; geometry.current.innerMax = h - 600 },
    restore() { if (globalThis.window === window) { cleanup?.(); Object.assign(globalThis, original) } } }
}

test('undefined request does not auto-open; tall to short resets before height reconciliation', () => {
  const f = fixture()
  try {
    f.render(undefined)
    assert.equal(f.calls.length, 0)
    f.window.scrollY = 850; f.live.current.pe = 1; f.live.current.cur = 750
    f.measureRef.current.offsetHeight = 650
    f.render({ key: 'work-1' })
    assert.equal(f.window.scrollY, 400)
    assert.equal(f.live.current.cur, 300)
    f.setContentHeight(650)
    f.render({ key: 'work-1' })
    f.frame()
    assert.deepEqual(f.focus.map(x => x.key), ['view-root'])
    assert.equal(f.frames.size, 0)
  } finally { f.restore() }
})

test('folded request unfolds smoothly to a deep current-view target and focuses after arrival', () => {
  const f = fixture()
  try {
    f.render({ key: 'work-1', target: 'project-one' })
    assert.deepEqual(f.calls.at(-1), { top: 600, behavior: 'smooth' })
    f.frame(); assert.equal(f.focus.length, 0)
    f.window.scrollY = 600; f.live.current.pe = 1
    f.frame()
    assert.deepEqual(f.focus.map(x => x.key), ['project-one'])
    assert.deepEqual(f.focus[0].options, { preventScroll: true })
  } finally { f.restore() }
})

test('new key supersedes pending focus; repeated target, resize and unmount leave no stale frame', () => {
  const f = fixture()
  try {
    f.render({ key: 'work-1', target: 'project-one' })
    f.render({ key: 'about-2' })
    f.window.scrollY = 400; f.live.current.pe = 1
    f.frame()
    assert.deepEqual(f.focus.map(x => x.key), ['view-root'])
    f.render({ key: 'about-3' })
    f.frame()
    assert.deepEqual(f.focus.map(x => x.key), ['view-root', 'view-root'])
    f.measureRef.current.offsetHeight = 1200
    f.render({ key: 'work-4', target: 'project-one' })
    f.setContentHeight(1200); f.render({ key: 'work-4', target: 'project-one' })
    assert.equal(f.window.scrollY, 676)
    f.geometry.current.U1 = 500
    f.render({ key: 'work-4', target: 'project-one' })
    assert.equal(f.window.scrollY, 876)
    f.restore()
    assert.equal(f.frames.size, 0)
  } finally { f.restore() }
})

for (const mode of ['fold', 'open']) test(`${mode}: settled same-key height growth keeps the user's position`, () => {
  const f = fixture(mode)
  try {
    f.render({ key: 'work-1' })
    if (mode === 'fold') { f.window.scrollY = 400; f.live.current.pe = 1 }
    f.frame()
    const scrolled = mode === 'fold' ? 550 : 250
    f.window.scrollY = scrolled
    f.setContentHeight(1400)
    f.render({ key: 'work-1' })
    assert.equal(f.window.scrollY, scrolled)
    assert.deepEqual(f.focus.map(x => x.key), ['view-root'])
    f.frame()
    assert.equal(f.focus.length, 1)
  } finally { f.restore() }
})

for (const mode of ['fold', 'open']) test(`${mode}: settled height shrink clamps within the open content`, () => {
  const f = fixture(mode)
  try {
    f.render({ key: 'work-1' })
    if (mode === 'fold') { f.window.scrollY = 400; f.live.current.pe = 1 }
    f.frame()
    f.window.scrollY = mode === 'fold' ? 550 : 250
    f.setContentHeight(650)
    f.render({ key: 'work-1' })
    assert.equal(f.window.scrollY, mode === 'fold' ? 425 : 125)
    assert.equal(f.focus.length, 1)
  } finally { f.restore() }
})

test('a pending folded request yields to user scroll and never retargets after lazy growth', () => {
  const f = fixture()
  try {
    f.render({ key: 'work-1', target: 'project-one' })
    f.window.scrollY = 520
    f.window.dispatchEvent(new Event('wheel'))
    assert.equal(f.window.scrollY, 520)
    const calls = f.calls.length
    f.window.dispatchEvent(new Event('wheel'))
    assert.equal(f.calls.length, calls)
    f.setContentHeight(1400)
    f.render({ key: 'work-1', target: 'project-one' })
    f.frame()
    assert.equal(f.window.scrollY, 520)
    assert.equal(f.focus.length, 0)
    assert.equal(f.frames.size, 0)
  } finally { f.restore() }
})

for (const mode of ['fold', 'open']) test(`${mode}: resize preserves scrolled content offset, not the stale target`, () => {
  const f = fixture(mode)
  try {
    f.render({ key: 'work-1' })
    if (mode === 'fold') { f.window.scrollY = 400; f.live.current.pe = 1 }
    f.frame()
    f.window.scrollY = mode === 'fold' ? 550 : 250
    if (mode === 'fold') f.geometry.current.U1 = 500
    else f.geometry.current.s = 1
    f.render({ key: 'work-1' })
    assert.equal(f.window.scrollY, mode === 'fold' ? 750 : 400)
    assert.equal(f.focus.length, 1)
  } finally { f.restore() }
})

test('fold resize preserves closing and final-hold progress after a settled request', () => {
  const f = fixture()
  try {
    f.render({ key: 'work-1' })
    f.window.scrollY = 400; f.live.current.pe = 1; f.frame()
    f.window.scrollY = 750
    f.geometry.current.U1 = 500; f.geometry.current.U2 = 400; f.geometry.current.U3 = 200
    f.render({ key: 'work-1' })
    assert.equal(f.window.scrollY, 1000)
    f.window.scrollY = 1250
    f.geometry.current.U2 = 500; f.geometry.current.U3 = 300
    f.render({ key: 'work-1' })
    assert.equal(f.window.scrollY, 1375)
  } finally { f.restore() }
})

for (const mode of ['fold', 'open']) test(`${mode}: resize outside the device does not snap back inside it`, () => {
  const f = fixture(mode)
  try {
    f.render({ key: 'work-1' })
    if (mode === 'fold') { f.window.scrollY = 400; f.live.current.pe = 1 }
    f.frame()
    f.window.scrollY = 50
    f.geometry.current.s = 0.8
    f.render({ key: 'work-1' })
    assert.equal(f.window.scrollY, 50)
    f.window.scrollY = 1200
    f.geometry.current.s = 0.9
    f.render({ key: 'work-1' })
    assert.equal(f.window.scrollY, 1200)
  } finally { f.restore() }
})

test('clearing a pending request cancels old focus and does not revive it on height change', () => {
  const f = fixture()
  try {
    f.render({ key: 'work-1', target: 'project-one' })
    f.window.scrollTo({ top: 0, behavior: 'smooth' }) // Parent owns the return-to-entry scroll.
    f.render(undefined)
    assert.deepEqual(f.calls.at(-1), { top: 0, behavior: 'smooth' })
    f.setContentHeight(1400)
    f.render(undefined)
    f.window.scrollY = 600; f.live.current.pe = 1
    f.frame()
    assert.deepEqual(f.focus, [])
    assert.equal(f.frames.size, 0)
    f.render({ key: 'about-2' })
    f.window.scrollY = 400; f.live.current.pe = 1; f.frame()
    assert.deepEqual(f.focus.map(x => x.key), ['view-root'])
  } finally { f.restore() }
})

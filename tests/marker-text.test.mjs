import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { transformWithOxc } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

const source = await readFile(new URL('../src/features/portfolio/components/kokonut/MarkerText.tsx', import.meta.url), 'utf8')
const { code } = await transformWithOxc(source, 'MarkerText.tsx', { jsx: { runtime: 'automatic' } })
const data = value => 'data:text/javascript,' + encodeURIComponent(value)
const classes = data('export const cn=(...v)=>v.filter(Boolean).join(" ")')
const jsx = data('export const jsx=(type,props)=>({type,props});export const jsxs=jsx')
const react = data(`
  export const createContext=()=>({Provider:'provider'});
  export const useContext=()=>globalThis.__markerFixture.context;
  export const useCallback=fn=>fn;
  export const useId=()=>String(globalThis.__markerFixture.id++);
  export const useRef=v=>{const ref={current:v};globalThis.__markerFixture.refs.push(ref);return ref};
  export const useState=v=>{const f=globalThis.__markerFixture,i=f.stateIndex++;if(!(i in f.states))f.states[i]=v;return[f.states[i],n=>{f.writes++;f.states[i]=n}]};
  export const useEffect=fn=>globalThis.__markerFixture.effects.push(fn);
  export const useLayoutEffect=fn=>globalThis.__markerFixture.layout.push(fn);
`)
function moduleCode(realReact) {
  return code.replaceAll('"../../lib/classes"', JSON.stringify(classes))
    .replaceAll('"react/jsx-runtime"', JSON.stringify(realReact ? import.meta.resolve('react/jsx-runtime') : jsx))
    .replaceAll('"react"', JSON.stringify(realReact ? import.meta.resolve('react') : react))
}
const mocked = await import(data(moduleCode(false)))
const real = await import(data(moduleCode(true)))

function fixture({ states = [], props = {} } = {}) {
  const f = { refs: [], effects: [], layout: [], states, stateIndex: 0, writes: 0, id: 0 }
  globalThis.__markerFixture = f
  f.tree = mocked.MarkerText({ children: 'Text remains readable', ...props })
  f.rootRef = f.tree.props.children.props.ref
  f.registry = f.tree.props.value
  return f
}

function measure(scaleX = 1, scaleY = scaleX) {
  const f = fixture()
  const origin = { left: 100, top: 80, width: 400 * scaleX, height: 200 * scaleY }
  const physical = r => ({
    left: origin.left + r.left * scaleX, right: origin.left + r.right * scaleX,
    top: origin.top + r.top * scaleY, bottom: origin.top + r.bottom * scaleY,
    width: (r.right - r.left) * scaleX,
  })
  const types = ['highlight', 'underline', 'circle', 'box', 'strike']
  const entries = types.map((type, i) => ({
    type,
    el: { textContent: `Official ${type}`, getClientRects: () => [
      physical({ left: 10, right: 210, top: i * 30, bottom: i * 30 + 22 }),
      ...(type === 'highlight' ? [physical({ left: 10, right: 130, top: 30, bottom: 52 })] : []),
    ] },
  }))
  f.rootRef.current = { offsetWidth: 400, offsetHeight: 200, getBoundingClientRect: () => origin, querySelectorAll: () => entries.map(e => e.el) }
  // Register backwards to prove that reading order comes from the DOM.
  entries.toReversed().forEach((entry, i) => f.registry.add(String(i), entry))
  return f.states[0]
}

test('all five official mark shapes normalize scale without changing their paths or reading order', () => {
  const normal = measure()
  assert.equal(normal.length, 6) // Wrapped highlight has two strokes.
  assert.deepEqual(normal.map(s => s.color), ['#facc15', '#facc15', '#f97316', '#2563eb', '#16a34a', '#dc2626'])
  assert.deepEqual(normal.map(s => [s.under, s.alpha]), [[true, .42], [true, .42], [false, 1], [false, 1], [false, 1], [false, 1]])
  assert.equal(normal[0].duration, 260)
  assert.equal(normal[1].delay, normal[0].duration + 60)
  assert.equal(normal[2].delay, normal[1].delay + normal[1].duration + 140)
  for (const [sx, sy] of [[.5, .5], [2, 2], [.985, .985], [.5, .75]]) {
    const scaled = measure(sx, sy)
    assert.equal(scaled.length, normal.length)
    scaled.forEach((s, i) => {
      for (const key of ['shape', 'pen', 'key', 'color', 'alpha', 'under']) assert.equal(s[key], normal[i][key], `${sx}/${sy} ${key}`)
      for (const key of ['penWidth', 'length', 'delay', 'duration']) assert.ok(Math.abs(s[key] - normal[i][key]) < 1e-8, `${sx}/${sy} ${key}`)
    })
  }
})

test('SSR keeps paragraph/mark/strike semantics and both aria-hidden SVG layers', () => {
  const html = renderToStaticMarkup(createElement(real.MarkerText, { as: 'p' },
    createElement(real.Mark, null, 'First sentence.'), ' Rest of the intro. ',
    createElement(real.Mark, { type: 'strike' }, 'Old text'),
    createElement(real.Mark, { type: 'box' }, 'Boxed'),
  ))
  assert.match(html, /^<p class="relative isolate">/)
  assert.match(html, /<mark[^>]+data-mark="highlight">First sentence\.<\/mark>/)
  assert.match(html, /<s[^>]+data-mark="strike">Old text<\/s>/)
  assert.match(html, /whitespace-nowrap[^>]+data-mark="box"/)
  assert.equal((html.match(/aria-hidden="true"/g) || []).length, 2)
  assert.ok(html.indexOf('<svg') < html.indexOf('<mark'))
  assert.ok(html.lastIndexOf('<svg') > html.indexOf('Old text'))
})

test('font-ready and observer callbacks cannot mutate state after cleanup or StrictMode replay', () => {
  const f = fixture()
  f.rootRef.current = { getBoundingClientRect() { throw Error('Detached root measured') } }
  const originals = Object.fromEntries(['window', 'document', 'ResizeObserver', 'IntersectionObserver'].map(k => [k, globalThis[k]]))
  let fontReady
  const observers = []
  const listeners = new Map(), timers = new Map()
  class Observer {
    constructor(callback, options) { Object.assign(this, { callback, options, stopped: false }); observers.push(this) }
    observe() {}
    disconnect() { this.stopped = true }
  }
  Object.assign(globalThis, { window: {
    addEventListener: (key, fn) => listeners.set(key, fn),
    removeEventListener: key => listeners.delete(key),
    setTimeout: fn => { timers.set(1, fn); return 1 }, clearTimeout: key => timers.delete(key),
  }, document: { fonts: { ready: { then: fn => { fontReady = fn } } } }, ResizeObserver: Observer, IntersectionObserver: Observer })
  try {
    const stop = f.effects[0]()
    assert.equal(observers[1].options.threshold, .6)
    let refreshes = 0
    f.refs[2].current = () => refreshes++
    listeners.get('focusin')()
    listeners.get('scrollend')()
    const pendingRefresh = timers.get(1)
    pendingRefresh()
    assert.equal(refreshes, 2)
    stop()
    assert.equal(listeners.size, 0)
    assert.equal(timers.size, 0)
    pendingRefresh()
    assert.equal(refreshes, 2)
    const writes = f.writes
    fontReady()
    observers[0].callback()
    observers[1].callback([{ isIntersecting: true }])
    assert.equal(f.writes, writes)
    assert.ok(observers.every(o => o.stopped))
    const replayStop = f.effects[0]()
    observers[3].callback([{ isIntersecting: true }])
    assert.equal(f.states[1], true)
    replayStop()
  } finally { Object.assign(globalThis, originals) }
})

test('normal double-frame arming and completion timing remain active without media queries', () => {
  let completed = 0
  let measurements = 0
  const strokes = [{ delay: 140, duration: 820 }]
  const f = fixture({ states: [strokes, false, true], props: { show: true, onDrawn: () => completed++ } })
  f.refs[2].current = () => measurements++
  const original = Object.fromEntries(['window', 'requestAnimationFrame', 'cancelAnimationFrame'].map(k => [k, globalThis[k]]))
  const frames = new Map(), timers = new Map()
  let id = 0
  Object.assign(globalThis, {
    requestAnimationFrame: fn => { frames.set(++id, fn); return id },
    cancelAnimationFrame: key => frames.delete(key),
    window: { matchMedia() { throw Error('No reduced-motion query allowed') },
      setTimeout(fn, delay) { timers.set(++id, { fn, delay }); return id }, clearTimeout(key) { timers.delete(key) } },
  })
  try {
    const stopFrames = f.effects[1]()
    assert.equal(frames.size, 1)
    const first = [...frames.values()][0]; frames.clear(); first()
    assert.equal(measurements, 1) // Refresh local coordinates before the draw arms.
    assert.equal(frames.size, 1)
    const second = [...frames.values()][0]; frames.clear(); second()
    assert.equal(f.states[2], true)
    const stopTimer = f.effects[2]()
    assert.equal([...timers.values()][0].delay, 960)
    assert.equal(completed, 0)
    ;[...timers.values()][0].fn()
    assert.equal(completed, 1)
    stopTimer(); stopFrames()
    assert.equal(timers.size, 0); assert.equal(frames.size, 0)
    assert.doesNotMatch(source, /matchMedia|prefers-reduced-motion|\breduced\b/)
  } finally { Object.assign(globalThis, original) }
})

test('unmount cancels either pending animation frame without arming', () => {
  for (const afterFirst of [false, true]) {
    const f = fixture({ props: { show: true } })
    const original = { requestAnimationFrame: globalThis.requestAnimationFrame, cancelAnimationFrame: globalThis.cancelAnimationFrame }
    const frames = new Map()
    let id = 0
    globalThis.requestAnimationFrame = fn => { frames.set(++id, fn); return id }
    globalThis.cancelAnimationFrame = key => frames.delete(key)
    try {
      const stop = f.effects[1]()
      if (afterFirst) { const fn = [...frames.values()][0]; frames.clear(); fn() }
      stop()
      assert.equal(frames.size, 0)
      assert.equal(f.states[2], false)
    } finally { Object.assign(globalThis, original) }
  }
})

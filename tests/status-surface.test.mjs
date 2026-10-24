import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { parseSync, traverse } from '@babel/core'

const resolver = registerHooks({ resolve(specifier, context, next) {
  if (specifier === 'react') return next('data:text/javascript,export const useRef=current=>({current}); export const useEffect=()=>{}; export const useLayoutEffect=useEffect', context)
  if (context.parentURL?.endsWith('/hooks/useScreenMotion.ts')) {
    if (['../lib/math', '../lib/colors'].includes(specifier)) return next(specifier + '.ts', context)
    if (specifier === './useIsoLayoutEffect') return next(specifier + '.ts', context)
  }
  if (context.parentURL?.endsWith('/lib/colors.ts') && specifier === '../config/constants') return next(specifier + '.ts', context)
  return next(specifier, context)
} })
const { useScreenMotion } = await import('../src/features/foldfolio/hooks/useScreenMotion.ts')
resolver.deregister()

// Layout-only DOM fixture exercises the real scanner, not a duplicated surface collector.
class Element {
  children = []
  parentElement = null
  offsetParent = null
  tagName = 'DIV'
  backgroundColor = 'rgba(0, 0, 0, 0)'
  paddingLeft = '0px'
  paddingRight = '0px'
  constructor({ top = 0, left = 0, width = 976, height = 100, background, surface = false } = {}) {
    Object.assign(this, { offsetTop: top, offsetLeft: left, offsetWidth: width, clientWidth: width, offsetHeight: height, surface })
    if (background) this.backgroundColor = background
  }
  append(child) {
    this.children.push(child)
    child.parentElement = child.offsetParent = this
    return child
  }
  get firstElementChild() { return this.children[0] || null }
  hasAttribute(name) { return name === 'data-ff-surface' && this.surface }
  querySelectorAll(selector) {
    return this.children.flatMap(child => [child, ...child.querySelectorAll('*')])
      .filter(child => selector === '*' || (selector === '[data-ff-surface]' && child.surface))
  }
  getBoundingClientRect() {
    let top = 0, left = 0
    for (let el = this; el; el = el.offsetParent) { top += el.offsetTop; left += el.offsetLeft }
    return { top, left, right: left + this.offsetWidth, bottom: top + this.offsetHeight }
  }
}
const light = 'rgb(244, 243, 240)', dark = 'rgb(11, 11, 11)'
const luminance = rgb => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number)
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}
const ink = (sections, y) => {
  const section = sections.filter(section => section.top <= y).at(-1)
  return [section.lum, section.lumR].map(lum => lum > 0.6 ? '#111' : '#fff')
}

function useFixture(width = 976) {
  const main = new Element({ width, height: 3000 })
  const layer = main.append(new Element({ width, height: 3000 }))
  const slot = layer.append(new Element({ top: 37, width, height: 2900, background: light }))
  const tintMap = { current: [] }, topRef = { current: 0 }
  const original = { window: globalThis.window, document: globalThis.document }
  Object.assign(globalThis, {
    document: {},
    window: { getComputedStyle: el => el, scrollY: 100 },
  })
  const noop = () => {}
  const { scan } = useScreenMotion({
    isCanvas: false, R: { cL: { current: null }, cR: { current: main }, cOpen: { current: null } },
    autoImgs: { current: [] }, measureSat: noop, measureLum: noop, paintScenes: { current: noop },
    screenColor: '#f4f3f0', tintMap, rootRef: { current: main }, topRef,
    motionOn: false, mo: { hover: false }, kick: { current: noop }, live: { current: {} }, geo: { current: {} },
  })
  return { main, slot, scan: () => { scan.current(); return tintMap.current }, topRef,
    restore: () => Object.assign(globalThis, original) }
}

test('nested Contact light form overrides dark hero without losing split left/right sampling', () => {
  const f = useFixture()
  try {
    const view = f.slot.append(new Element({ height: 1500, surface: true }))
    const hero = view.append(new Element({ height: 660, background: dark, surface: true }))
    hero.append(new Element({ width: 488, height: 660 }))
    hero.append(new Element({ left: 488, width: 488, height: 660, background: light, surface: true }))
    view.append(new Element({ top: 660, height: 840, background: light, surface: true }))
    const sections = f.scan()
    assert.deepEqual(sections.map(section => section.top), [0, 37, 37, 697])
    assert.deepEqual(ink(sections, 37), ['#fff', '#111'])
    assert.deepEqual(ink(sections, 697), ['#111', '#111'])
    assert.equal(f.topRef.current, 100)
    assert.equal(sections.at(-1).lum, luminance(light))
  } finally { f.restore() }
})

test('About copy is excluded at desktop half-width and included after compact stacking/rescan', () => {
  const f = useFixture()
  try {
    const hero = f.slot.append(new Element({ height: 1280, background: light, surface: true }))
    const photo = hero.append(new Element({ width: 454, height: 660, background: light, surface: true }))
    const copy = hero.append(new Element({ left: 454, width: 522, height: 620, background: dark, surface: true }))
    assert.deepEqual(ink(f.scan(), 37), ['#111', '#fff'])
    assert.equal(f.scan().length, 2, 'direct-child hero appears only once; half-width markers never override it')
    for (const el of [f.main, f.main.firstElementChild, f.slot, hero, photo, copy]) el.offsetWidth = el.clientWidth = 358
    copy.offsetLeft = 0
    copy.offsetTop = 660
    const sections = f.scan()
    assert.deepEqual(sections.map(section => section.top), [0, 37, 37, 697])
    assert.deepEqual(ink(sections, 37), ['#111', '#111'])
    assert.deepEqual(ink(sections, 697), ['#fff', '#fff'])
  } finally { f.restore() }
})

test('padded compact Home recognizes dark metrics then light body at original nested offsets', () => {
  const f = useFixture(358)
  try {
    f.slot.paddingLeft = f.slot.paddingRight = '26px'
    const view = f.slot.append(new Element({ width: 306, height: 2100, surface: true }))
    view.append(new Element({ top: 800, left: -26, width: 358, height: 200, background: dark, surface: true }))
    view.append(new Element({ top: 1048, width: 306, height: 500, surface: true }))
    const sections = f.scan()
    assert.deepEqual(sections.map(section => section.top), [0, 37, 837, 1085])
    assert.deepEqual(ink(sections, 837), ['#fff', '#fff'])
    assert.deepEqual(ink(sections, 1085), ['#111', '#111'])
  } finally { f.restore() }
})

test('90% content-width cutoff rejects narrow/hidden markers but preserves legacy children and offsetParent tops', () => {
  const f = useFixture(1000)
  try {
    const view = f.slot.append(new Element({ height: 2000 }))
    view.append(new Element({ top: 100, width: 899, background: dark, surface: true }))
    view.append(new Element({ top: 200, width: 900, background: dark, surface: true }))
    view.append(new Element({ top: 300, height: 0, background: light, surface: true }))
    const nested = view.append(new Element({ top: 400, background: light, surface: true }))
    nested.offsetParent = f.main
    f.slot.append(new Element({ top: 500, width: 100, background: dark }))
    const sections = f.scan()
    assert.deepEqual(sections.map(section => section.top), [0, 37, 237, 400, 537])
    assert.deepEqual(ink(sections, 237), ['#fff', '#fff'])
    assert.deepEqual(ink(sections, 400), ['#111', '#111'])
  } finally { f.restore() }
})

test('five actual views mark surface boundaries, not arbitrary cards or controls', () => {
  const expected = {
    Home: ['pf-page home-page', 'home-hero', '', 'home-impact', 'pf-section home-work', 'pf-section home-contact'],
    Work: ['pf-page pf-work', 'pf-metrics pf-work__metrics', 'pf-section pf-work__contact'],
    Projects: ['pf-page pf-page--dark pf-projects'],
    About: ['pf-page about-view', 'about-view__hero', '', 'about-view__copy pf-page--dark', 'about-view__numbers', 'about-view__body', 'pf-section about-view__contact'],
    Contact: ['contact-view', 'pf-page pf-page--dark contact-view__hero', '', 'pf-page contact-view__brief'],
  }
  for (const [view, classes] of Object.entries(expected)) {
    const source = readFileSync(new URL(`../src/features/portfolio/components/views/${view}View.tsx`, import.meta.url), 'utf8')
    const tree = parseSync(source, { configFile: false, babelrc: false, parserOpts: { plugins: ['typescript', 'jsx'] } })
    const marked = []
    traverse(tree, { JSXOpeningElement(path) {
      const attrs = path.node.attributes
      if (attrs.some(attr => attr.name?.name === 'data-ff-surface')) {
        marked.push(attrs.find(attr => attr.name?.name === 'className')?.value.value || '')
        assert.ok(['div', 'article', 'header', 'section', 'dl'].includes(path.node.name.name))
      }
    } })
    assert.deepEqual(marked, classes, view)
  }
})

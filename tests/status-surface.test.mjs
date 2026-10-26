import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { parseSync, traverse } from '@babel/core'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

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
  constructor({ top = 0, left = 0, width = 976, height = 100, background, surface = false, tag = 'DIV', src } = {}) {
    Object.assign(this, { offsetTop: top, offsetLeft: left, offsetWidth: width, clientWidth: width, offsetHeight: height, surface, tagName: tag })
    if (background) this.backgroundColor = background
    if (src) this.currentSrc = this.src = src
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
// Mirrors renderer selection/threshold arithmetic, including image-luminance override.
const ink = (sections, y, imgLum = {}) => {
  const section = sections.filter(section => section.top <= y).at(-1)
  return [[section.lum, section.src], [section.lumR, section.srcR]]
    .map(([lum, src]) => (imgLum[src] ?? lum) > 0.6 ? '#111' : '#fff')
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

test('nested full-width padded page restores compact light body without accepting narrow columns', () => {
  const f = useFixture(358)
  try {
    const page = f.slot.append(new Element({ width: 358, height: 2100, surface: true }))
    page.paddingLeft = page.paddingRight = '26px'
    page.append(new Element({ top: 800, width: 358, background: dark, surface: true }))
    page.append(new Element({ top: 1048, width: 306, background: light, surface: true }))
    const column = page.append(new Element({ top: 1500, width: 153 }))
    column.append(new Element({ width: 153, background: dark, surface: true }))
    const sections = f.scan()
    assert.deepEqual(ink(sections, 837), ['#fff', '#fff'])
    assert.deepEqual(ink(sections, 1085), ['#111', '#111'])
    assert.deepEqual(ink(sections, 1537), ['#111', '#111'])
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

test('Work actual markers scan light intro, shared dark current and past, then light footer without logo sampling', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { WorkView } = await server.ssrLoadModule('/src/features/portfolio/components/views/WorkView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    const html = renderToStaticMarkup(createElement(WorkView, { data: portfolio.en, onNavigate() {} }))
    const currentMarkup = html.match(/<article\b[^>]*data-ff-section="job-current"[^>]*>/)?.[0]
    const pastMarkup = html.match(/<article\b[^>]*work-record--past[^>]*>/)?.[0]
    const historyMarkup = html.match(/<section\b[^>]*class="work-history"[^>]*>/)?.[0]
    assert.ok(currentMarkup && pastMarkup, 'rendered real employment records are the fixture inputs')
    const marked = markup => /\bdata-ff-surface="true"/.test(markup ?? '')
    const f = useFixture()
    try {
      const page = f.slot.append(new Element({ height: 2000, background: light, surface: marked(html.match(/<div\b[^>]*class="pf-page pf-work"[^>]*>/)?.[0]) }))
      const history = page.append(new Element({ top: 245, height: 800, background: dark, surface: marked(historyMarkup) }))
      const current = history.append(new Element({ top: 40, left: 32, width: 912, height: 146, surface: marked(currentMarkup) }))
      const currentHeader = current.append(new Element({ width: 912, height: 96 }))
      const logo = portfolio.en.experience.find(job => job.current).logo
      currentHeader.append(new Element({ width: 96, height: 96, background: light, tag: 'IMG', src: logo }))
      currentHeader.append(new Element({ left: 120, width: 792, height: 96 }))
      const past = history.append(new Element({ top: 266, left: 32, width: 912, height: 494, surface: marked(pastMarkup) }))
      const pastHeader = past.append(new Element({ width: 912, height: 96 }))
      pastHeader.append(new Element({ width: 96, height: 96, background: light, tag: 'IMG', src: portfolio.en.experience.find(job => !job.current).logo }))
      pastHeader.append(new Element({ left: 120, width: 792, height: 96 }))
      page.append(new Element({ top: 1100, height: 200, surface: marked(html.match(/<footer\b[^>]*>/)?.[0]) }))
      const sections = f.scan()
      const at = y => sections.filter(section => section.top <= y).at(-1)
      assert.deepEqual(sections.map(section => section.top), [0, 37, 282, 1137])
      assert.deepEqual(ink(sections, 200), ['#111', '#111'], 'intro stays light')
      for (const y of [330, 500, 600, 900]) {
        assert.equal(at(y).top, 282, 'current, gap and past all inherit the actual history boundary')
        assert.equal(at(y).src, undefined, 'adjacent logo never becomes the left status source')
        assert.equal(at(y).srcR, undefined, 'adjacent logo never becomes the right status source')
        assert.equal(at(y).lum, luminance(dark))
        assert.equal(at(y).lumR, luminance(dark))
      }
      assert.equal(at(1200).top, 1137, 'marked light footer resets the modeled scanner boundary')
      assert.equal(at(1200).lum, luminance(light))
      assert.equal(at(1200).lumR, luminance(light))
      const seededImageLum = { [logo]: 0.5 }
      assert.deepEqual(ink(sections, 200, seededImageLum), ['#111', '#111'])
      assert.deepEqual(ink(sections, 330, seededImageLum), ['#fff', '#fff'])
      assert.deepEqual(ink(sections, 500, seededImageLum), ['#fff', '#fff'])
      assert.deepEqual(ink(sections, 1200, seededImageLum), ['#111', '#111'])
    } finally { f.restore() }
  } finally { await server.close() }
})

test('five actual views mark surface boundaries, not arbitrary cards or controls', () => {
  const expected = {
    Home: ['pf-page home-page', 'home-hero', '', 'pf-section home-work', 'pf-section home-honors', 'home-impact', 'home-footer'],
    Work: ['pf-page pf-work', 'work-footer'],
    Projects: ['pf-page pf-projects'],
    About: ['article:page', 'header:intro', 'div:dark-copy', 'div:portrait-media', 'section:about-impact', 'div:body', 'section:about-contact'],
    Contact: ['contact-view', 'pf-page pf-page--dark contact-view__hero', 'pf-page contact-view__brief'],
  }
  for (const [view, classes] of Object.entries(expected)) {
    const source = readFileSync(new URL(`../src/features/portfolio/components/views/${view}View.tsx`, import.meta.url), 'utf8')
    const tree = parseSync(source, { configFile: false, babelrc: false, parserOpts: { plugins: ['typescript', 'jsx'] } })
    const marked = []
    traverse(tree, { JSXOpeningElement(path) {
      const attrs = path.node.attributes
      if (attrs.some(attr => attr.name?.name === 'data-ff-surface')) {
        const className = attrs.find(attr => attr.name?.name === 'className')?.value.value || ''
        if (view === 'About') {
          const node = path.parentPath.node
          const parent = path.parentPath.parentPath.node
          const containsPortrait = element => element.type === 'JSXElement' && (element.openingElement.name.name === 'Portrait' || element.children.some(containsPortrait))
          const section = attrs.find(attr => attr.name?.name === 'data-ff-section')?.value.value
          const role = section || (path.node.name.name === 'article' ? 'page'
            : className.split(/\s+/).includes('pf-page--dark') ? 'dark-copy'
              : containsPortrait(node) ? 'portrait-media' : 'body')
          if (['dark-copy', 'portrait-media', 'body'].includes(role)) {
            assert.equal(parent.type, 'JSXElement')
            assert.equal(parent.openingElement.name.name, role === 'body' ? 'article' : 'header', `About: ${role} surface boundary`)
          }
          marked.push(`${path.node.name.name}:${role}`)
        } else marked.push(className)
        assert.ok(['div', 'article', 'header', 'section', 'footer', 'dl'].includes(path.node.name.name))
      }
    } })
    assert.deepEqual(view === 'About' ? marked.toSorted() : marked, view === 'About' ? classes.toSorted() : classes, view)
  }
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { createElement, Children, isValidElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { transformWithOxc } from 'vite'

// Transform only the two TSX modules in memory: no Vite server or browser.
const transformed = new Map()
for (const path of ['components/renderDevice.tsx', 'components/Slot.tsx']) {
  const url = new URL(`../src/features/foldfolio/${path}`, import.meta.url)
  transformed.set(url.href, (await transformWithOxc(readFileSync(url, 'utf8'), url.pathname)).code)
}
const resolver = registerHooks({
  resolve(specifier, context, next) {
    if (context.parentURL?.includes('/features/foldfolio/') && specifier.startsWith('.')) {
      return next(specifier + (specifier === './Slot' ? '.tsx' : '.ts'), context)
    }
    return next(specifier, context)
  },
  load(url, context, next) {
    return transformed.has(url) ? { format: 'module', source: transformed.get(url), shortCircuit: true } : next(url, context)
  },
})
const { renderDevice } = await import('../src/features/foldfolio/components/renderDevice.tsx')
const { createFrameRenderer } = await import('../src/features/foldfolio/engine/createFrameRenderer.ts')
resolver.deregister()

const logo = { src: '/normal.png', srcOnDark: '/on-dark.png', label: 'Currently working at VinFast' }
const age = { batteryText: '21', batteryLabel: 'Age 21 — not device battery level' }
const refs = new Proxy({}, { get: () => ({ current: null }) })
function render(status = {}, port = false, mode = 'open', interactive = true) {
  return renderDevice({
    G: { W: 976, H: 660, f: 5, bz: 4, R: 22 }, b: 9, F: ['#aaa', '#bbb', '#ccc', '#ddd'],
    status: { show: true, tone: 'auto', ...age, ...status }, port, clock: '12:34', R: refs,
    halfW: 479, halfH: 642, Ws: 958, mode, measureRef: { current: null }, screenNode: null,
    screenInteractiveNode: interactive ? createElement('div', null, 'canonical') : null,
    land: !port, inner: () => '0', screenColor: '#fff', coverNode: null, rootRef: { current: null },
    live: { current: { k: 0 } }, geo: { current: {} }, callNode: null, cRight: '0', cLeaf: '0',
    hingeBleed: 1, cAll: '0', Ro: 22, Hs: 642, navNode: null, screenOverlayNode: null, signalLevel: 3,
  }).device
}
function elements(node, predicate) {
  if (!isValidElement(node)) return []
  return [...(predicate(node) ? [node] : []), ...Children.toArray(node.props.children).flatMap(child => elements(child, predicate))]
}
const marked = (node, key) => elements(node, el => el.props[key] !== undefined)

test('optional employer API stays generic and leaves clock/signal/fallback intact', () => {
  const types = readFileSync(new URL('../src/features/foldfolio/types.ts', import.meta.url), 'utf8')
  assert.match(types, /employerLogo\?: \{ src: string; srcOnDark\?: string; label: string \}/)
  const device = render({ batteryText: undefined })
  const html = renderToStaticMarkup(device)
  assert.equal(marked(device, 'data-ff-employer').length, 0)
  assert.equal(marked(device, 'data-ff-battery').length, 0)
  assert.match(html, /12:34/)
  assert.match(html, /width="25" height="12" viewBox="0 0 25 12"/)
  const signal = marked(device, 'data-ff-signal')[0]
  const bars = Children.toArray(signal.props.children)
  assert.equal(bars.length, 5)
  assert.deepEqual(bars.map(bar => bar.props.style.opacity), [1, 1, 1, .22, .22])
})

test('logo→signal→5G→age stays in the last-child group across hardware and canonical copies', () => {
  for (const port of [false, true]) for (const mode of ['fold', 'open']) for (const interactive of [false, true]) {
    const device = render({ employerLogo: logo }, port, mode, interactive)
    const groups = elements(device, el => Children.toArray(el.props.children).some(child => isValidElement(child) && child.props['data-ff-employer'] !== undefined))
    assert.ok(groups.length > 0)
    for (const group of groups) {
      const [employer, signal, network, battery] = Children.toArray(group.props.children)
      assert.equal(group.props.style.gap, 6)
      assert.equal(employer.props['aria-label'], logo.label)
      assert.equal(employer.props.role, 'img')
      assert.equal(employer.props.style.width, 22)
      assert.equal(employer.props.style.height, 22)
      assert.equal(signal.props['data-ff-signal'], '')
      assert.equal(network.props.children, '5G')
      assert.equal(battery.props['aria-label'], age.batteryLabel)
      assert.equal(battery.props.width, '30')
      assert.equal(battery.props.height, '14')
      const rects = elements(battery, el => el.type === 'rect')
      assert.equal(rects.length, 2, 'outline and terminal only, no charge fill')
      assert.equal(rects[0].props.fill, 'none')
      assert.equal(rects[1].props.x, '28')
      const text = elements(battery, el => el.type === 'text')[0]
      assert.equal(text.props.children, '21')
      assert.equal(text.props.fill, 'currentColor')
      const parent = elements(device, el => Children.toArray(el.props.children).some(child => child.props === group.props))[0]
      assert.equal(Children.toArray(parent.props.children).at(-1).props, group.props)
    }
  }
  assert.equal(marked(render({ show: false, employerLogo: logo }), 'data-ff-employer').length, 0)
})

test('fixed tint and missing dark variant have deterministic initial image presentation', () => {
  for (const [tone, expected] of [['dark', ['block', 'none']], ['light', ['none', 'block']],
    ['auto', ['var(--ffsb-logo-normal, none)', 'var(--ffsb-logo-on-dark, block)']]]) {
    const employer = marked(render({ tone, employerLogo: logo }), 'data-ff-employer')[0]
    const images = elements(employer, el => el.type === 'img')
    assert.deepEqual(images.map(image => image.props.src), [logo.src, logo.srcOnDark])
    assert.deepEqual(images.map(image => image.props.style.display), expected)
    for (const image of images) {
      assert.equal(image.props.width, '22')
      assert.equal(image.props.height, '22')
      assert.equal(image.props.alt, '')
      assert.equal(image.props['aria-hidden'], 'true')
      assert.equal(image.props.style.objectFit, 'contain')
    }
  }
  const employer = marked(render({ employerLogo: { src: logo.src, label: logo.label } }), 'data-ff-employer')[0]
  const images = elements(employer, el => el.type === 'img')
  assert.equal(images.length, 1)
  assert.equal(images[0].props.style.display, 'block')
})

test('age remains caller-owned localized content, with no percentage or charge state', () => {
  for (const [batteryText, batteryLabel] of [['21', '21 tuổi — không phải mức pin thiết bị'],
    ['22', 'Age 22 — not device battery level']]) {
    const battery = marked(render({ batteryText, batteryLabel }), 'data-ff-battery')[0]
    assert.equal(battery.props['aria-label'], batteryLabel)
    assert.equal(elements(battery, el => el.type === 'text')[0].props.children, batteryText)
    const html = renderToStaticMarkup(battery)
    assert.doesNotMatch(html, /%|<path|charging|yellow|green/)
  }
  const source = readFileSync(new URL('../src/features/foldfolio/components/renderDevice.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(source, /getBattery|navigator\.connection|from ["'][^"']*(?:portfolio|app)\//)
})

test('real frame renderer resolves logo variables from right-side luminance, including split surfaces', () => {
  const style = () => ({ setProperty(name, value) { this[name] = value } })
  const bars = ['left', 'right', 'all'].map(part => ({ dataset: { ffsb: part }, style: style(), lastElementChild: { style: style() } }))
  const g = { G: { W: 976, H: 660 }, port: false, mode: 'open', s: 1, innerMax: 100, scene: 'none' }
  const live = { current: { k: 0, inner: 0, tint: '', bars: null } }
  const tintMap = { current: [{ top: 0, lum: .1, lumR: .9 }] }
  const frame = createFrameRenderer({ geo: { current: g }, motion: { float: false }, live, S() {}, R: refs,
    motionTick: { current() {} }, sceneList: () => [], sat: { current: {} }, glowCur: { current: '' },
    glowFlip: { current: 0 }, drawGlow() {}, status: { tone: 'auto' }, tintMap, imgLum: { current: {} },
    rootRef: { current: { querySelectorAll: () => bars } },
  })
  const assertVariant = (target, normal, dark) => {
    assert.equal(target.style['--ffsb-logo-normal'], normal)
    assert.equal(target.style['--ffsb-logo-on-dark'], dark)
  }
  frame(0, 0)
  assertVariant(bars[0], 'none', 'block')
  assertVariant(bars[1], 'block', 'none')
  assertVariant(bars[2], 'none', 'block')
  assertVariant(bars[2].lastElementChild, 'block', 'none')
  tintMap.current[0] = { top: 0, lum: .9, lumR: .1 }
  frame(0, 16)
  assertVariant(bars[2].lastElementChild, 'none', 'block')
  // Geometry redraw resets the existing tint cache; React may retain status DOM.
  g.port = true
  live.current.tint = ''
  frame(0, 32)
  assertVariant(bars[2], 'block', 'none')
  assertVariant(bars[2].lastElementChild, 'block', 'none')
  assert.equal(bars[2].lastElementChild.style.color, '#111')
  g.port = false
  live.current.tint = ''
  frame(0, 48)
  assertVariant(bars[2].lastElementChild, 'none', 'block')
})

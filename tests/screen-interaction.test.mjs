import assert from 'node:assert/strict'
import test from 'node:test'
import { registerHooks } from 'node:module'
import { readFileSync } from 'node:fs'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('resize navigation reconciles scroll before the new geometry redraws the fold', () => {
  const source = readFileSync(new URL('../src/features/foldfolio/FoldfolioDevice.tsx', import.meta.url), 'utf8')
  const navigation = source.indexOf('useScreenNavigationRequest({')
  const redraw = source.indexOf('renderFrame.current(live.current.cur, performance.now())', navigation)
  assert.ok(navigation >= 0 && redraw > navigation)
})

test('one continuous screen is interactive below nav and drawer; hardware copies stay visual', async () => {
  const vite = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom', logLevel: 'error' })
  try {
    const { renderDevice } = await vite.ssrLoadModule('/src/features/foldfolio/components/renderDevice.tsx')
    const refs = new Proxy({}, { get: () => ({ current: null }) })
    const base = { G: { W: 976, H: 660, f: 5, bz: 4, R: 22 }, b: 9,
      F: ['#aaa', '#bbb', '#ccc', '#ddd'], status: { show: true, tone: 'auto' },
      port: false, clock: '12:34', R: refs, halfW: 479, halfH: 642, Ws: 958,
      measureRef: { current: null }, screenNode: React.createElement('form', { 'data-copy': '' }, React.createElement('input', { name: 'name' })),
      screenInteractiveNode: React.createElement('form', { 'data-real': '' }, React.createElement('input', { name: 'name' })),
      land: true, inner: () => '0', screenColor: '#fff', coverNode: null,
      rootRef: { current: null }, live: { current: { k: 0 } }, geo: { current: {} }, callNode: null,
      cRight: '0', cLeaf: '0', hingeBleed: 1, cAll: '0', Ro: 22, Hs: 642,
      navNode: React.createElement('nav', null, 'nav-marker'),
      screenOverlayNode: React.createElement('div', null, 'drawer-marker'), signalLevel: 3 }
    for (const mode of ['fold', 'open']) {
      const markup = renderToStaticMarkup(renderDevice({ ...base, mode }).device)
      assert.equal((markup.match(/data-ff-screen-interactive=""/g) || []).length, 1)
      assert.equal((markup.match(/data-real=""/g) || []).length, 1)
      assert.equal((markup.match(/data-copy=""/g) || []).length, mode === 'fold' ? 2 : 1)
      assert.equal((markup.match(/inert="" aria-hidden="true" style="position:absolute;left:/g) || []).length,
        mode === 'fold' ? 3 : 1)
      assert.ok(markup.indexOf('data-real') < markup.indexOf('nav-marker'))
      assert.ok(markup.indexOf('nav-marker') < markup.indexOf('drawer-marker'))
      assert.equal((markup.match(/data-ffsb="all"/g) || []).length, 1)
      assert.equal((markup.match(/data-ffsb="left"|data-ffsb="right"/g) || []).length,
        mode === 'fold' ? 2 : 0)
      if (mode === 'fold') assert.match(markup, /data-ff-screen-interactive="" data-ff-fold-inert="" inert="" aria-hidden="true"/)
      else assert.doesNotMatch(markup, /data-ff-screen-interactive="" inert=""/)
      assert.match(markup, /overflow:clip;pointer-events:none/)
    }
  } finally { await vite.close() }
})

const data = source => 'data:text/javascript,' + encodeURIComponent(source)
const bridges = {
  react: data('export const useRef=v=>({current:v});export const useImperativeHandle=(_ref,make)=>{globalThis.__interactionHandle=make()}'),
  './useIsoLayoutEffect': data('export const useIsoLayoutEffect=f=>globalThis.__interactionEffects?.push(f)'),
  '../engine/navigation': data('export const getSectionScrollY=(root,top,g)=>root+(g.mode==="fold"?g.U1:0)+Math.max(0,Math.min(top-48,g.innerMax))*g.s'),
  '../engine/snapshots': data('export const takeSnapshot=()=>{};export const releaseSnapshot=()=>{}'),
}
const resolver = registerHooks({ resolve(specifier, context, next) {
  return next(context.parentURL?.endsWith('/hooks/useSectionNavigation.ts') && bridges[specifier]
    ? bridges[specifier] : specifier, context)
} })
const { useSectionNavigation } = await import('../src/features/foldfolio/hooks/useSectionNavigation.ts')
resolver.deregister()

test('first-invalid helper reveals by untransformed layout offset and focuses without native scroll', () => {
  const original = { window: globalThis.window, document: globalThis.document,
    handle: globalThis.__interactionHandle }
  const jumps = []
  const screen = { inert: false, contains: element => element.offsetParent === screen }
  const field = { isConnected: true, offsetTop: 800, offsetHeight: 40, offsetParent: screen,
    focus(options) { assert.deepEqual(options, { preventScroll: true }); globalThis.document.activeElement = this } }
  const other = { ...field, offsetParent: {} }
  const window = { scrollY: 0 }
  const document = { activeElement: null }
  Object.assign(globalThis, { window, document })
  try {
    const rootRef = { current: { getBoundingClientRect: () => ({ top: 100 }) } }
    const refs = { cInteractive: { current: screen }, cOpen: { current: null }, cR: { current: null } }
    const geometry = { current: { mode: 'fold', U1: 300, s: .5, Hs: 600, innerMax: 800 } }
    const live = { current: { inner: 0 } }
    const jump = { current: y => jumps.push(y) }
    const { reveal } = useSectionNavigation(null, rootRef, refs, geometry, live, jump)
    assert.equal(globalThis.__interactionHandle.focusScreenElement(field), true)
    assert.deepEqual(jumps, [562])
    assert.equal(document.activeElement, field)
    assert.equal(globalThis.__interactionHandle.focusScreenElement(other), false)
    assert.equal(reveal.current(other), false)
    screen.inert = true
    assert.equal(globalThis.__interactionHandle.focusScreenElement(field), false)
  } finally {
    Object.assign(globalThis, { window: original.window, document: original.document,
      __interactionHandle: original.handle })
  }
})

test('visual-viewport keyboard emulation narrows focus reveal and removes resize/scroll listeners', () => {
  const original = { window: globalThis.window, document: globalThis.document,
    HTMLElement: globalThis.HTMLElement, effects: globalThis.__interactionEffects,
    handle: globalThis.__interactionHandle }
  const listeners = { resize: new Set(), scroll: new Set() }, frames = new Map(), jumps = []
  let nextFrame = 0
  const viewport = { offsetTop: 0, height: 300,
    addEventListener(type, handler) { listeners[type].add(handler) },
    removeEventListener(type, handler) { listeners[type].delete(handler) } }
  const window = { scrollY: 0, visualViewport: viewport,
    requestAnimationFrame(handler) { const id = ++nextFrame; frames.set(id, handler); return id },
    cancelAnimationFrame(id) { frames.delete(id) } }
  const screen = { inert: false, contains: element => element.offsetParent === screen }
  const field = { isConnected: true, offsetTop: 800, offsetHeight: 40, offsetParent: screen }
  const document = { activeElement: field }
  Object.assign(globalThis, { window, document, HTMLElement: Object, __interactionEffects: [] })
  let cleanup
  try {
    const root = { current: { getBoundingClientRect: () => ({ top: 100 }) } }
    const refs = { cInteractive: { current: screen }, overlay: { current: { getBoundingClientRect: () => ({ top: 100 }) } } }
    const geometry = { current: { mode: 'fold', U1: 300, s: .5, Hs: 600, innerMax: 800 } }
    const live = { current: { inner: 0 } }
    const jump = { current(y) { jumps.push(y); live.current.inner = (y - 400) / .5 } }
    const { reveal } = useSectionNavigation(null, root, refs, geometry, live, jump)
    cleanup = globalThis.__interactionEffects[1]()
    assert.deepEqual(Object.values(listeners).map(set => set.size), [1, 1])
    assert.equal(reveal.current(field), true)
    assert.deepEqual(jumps, [630], 'layout offset remains unscaled; viewport bottom maps through scale')
    viewport.height = 250
    for (const handler of listeners.resize) handler()
    assert.equal(frames.size, 1)
    for (const handler of frames.values()) handler()
    assert.deepEqual(jumps, [630, 680])
    for (const handler of listeners.scroll) handler()
    assert.equal(frames.size, 1)
    cleanup(); cleanup = undefined
    assert.deepEqual(Object.values(listeners).map(set => set.size), [0, 0])
    assert.equal(frames.size, 0)
  } finally {
    cleanup?.()
    Object.assign(globalThis, { window: original.window, document: original.document,
      HTMLElement: original.HTMLElement, __interactionEffects: original.effects,
      __interactionHandle: original.handle })
  }
})

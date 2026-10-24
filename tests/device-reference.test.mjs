import assert from 'node:assert/strict'
import test from 'node:test'
import { registerHooks } from 'node:module'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const bridge = 'data:text/javascript,' + encodeURIComponent('export const useState=v=>globalThis.__signalFixture.state(v);export const useEffect=(f)=>globalThis.__signalFixture.effects.push(f)')
const resolver = registerHooks({ resolve(specifier, context, next) {
  return next(context.parentURL?.endsWith('/hooks/useSignalLevel.ts') && specifier === 'react' ? bridge : specifier, context)
} })
const { useSignalLevel } = await import('../src/features/foldfolio/hooks/useSignalLevel.ts')
resolver.deregister()

test('one signal hook pauses hidden timers, resumes, and cleans up under remount', () => {
  const previous = { window: globalThis.window, document: globalThis.document, __signalFixture: globalThis.__signalFixture }
  let next = 0, level = 4, cleanup
  const timers = new Map(), listeners = new Set()
  const document = { visibilityState: 'visible', addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) }
  const window = { setTimeout(fn, delay) { assert.equal(delay, 2000); const id = ++next; timers.set(id, fn); return id }, clearTimeout(id) { timers.delete(id) } }
  const f = { effects: [], state(initial) { return [level ?? initial, nextLevel => { level = nextLevel }] } }
  Object.assign(globalThis, { window, document, __signalFixture: f })
  const oldRandom = Math.random
  Math.random = () => 0.99
  try {
    assert.equal(useSignalLevel(true), 4)
    cleanup = f.effects.pop()()
    assert.equal(timers.size, 1)
    assert.equal(listeners.size, 1)
    const tick = [...timers.values()][0]; timers.clear(); tick()
    assert.equal(level, 5)
    assert.equal(timers.size, 1)
    Math.random = () => 0
    const nextTick = [...timers.values()][0]; timers.clear(); nextTick()
    assert.equal(level, 2)
    document.visibilityState = 'hidden'; [...listeners][0]()
    assert.equal(timers.size, 0)
    document.visibilityState = 'visible'; [...listeners][0]()
    assert.equal(timers.size, 1)
    cleanup()
    assert.equal(timers.size, 0)
    assert.equal(listeners.size, 0)
    f.effects = []
    assert.equal(useSignalLevel(false), 2)
    f.effects.pop()()
    assert.equal(timers.size, 0)
    assert.equal(listeners.size, 0)
  } finally {
    cleanup?.(); Math.random = oldRandom
    Object.assign(globalThis, previous)
  }
})

test('overlay is one clipped screen child above nav, never duplicated across leaves', async () => {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', logLevel: 'error' })
  try {
    const { renderDevice } = await vite.ssrLoadModule('/src/features/foldfolio/components/renderDevice.tsx')
    const refs = new Proxy({}, { get: () => ({ current: null }) })
    const base = { G: { W: 976, H: 660, f: 5, bz: 4, R: 22 }, b: 9, F: ['#aaa', '#bbb', '#ccc', '#ddd'],
      status: { show: true, time: '12:34', tone: 'dark', batteryText: '21', batteryLabel: 'Age 21 — not device battery level' },
      port: false, clock: '12:34', R: refs, halfW: 479, halfH: 642, Ws: 958, mode: 'fold',
      measureRef: { current: null }, screenNode: React.createElement('div', null, 'screen'), land: true,
      inner: () => '0', screenColor: '#fff', coverNode: null, rootRef: { current: null },
      live: { current: { k: 0 } }, geo: { current: {} }, callNode: null,
      cRight: '0', cLeaf: '0', hingeBleed: 1, cAll: '0', Ro: 22, Hs: 642,
      navNode: React.createElement('nav', null, 'nav-marker'),
      screenOverlayNode: React.createElement('div', { role: 'dialog' }, 'overlay-marker'), signalLevel: 3 }
    for (const [mode, port] of [['fold', false], ['fold', true], ['open', false], ['open', true]]) {
      const markup = renderToStaticMarkup(renderDevice({ ...base, mode, port, land: !port }).device)
      assert.equal((markup.match(/data-ff-screen-overlay=""/g) || []).length, 1)
      assert.equal((markup.match(/overlay-marker/g) || []).length, 1)
      assert.ok(markup.indexOf('nav-marker') < markup.indexOf('overlay-marker'))
      assert.match(markup, /data-ff-screen-overlay=""[^>]*style="[^"]*position:absolute;inset:0/)
      assert.match(markup, /data-ff-signal="" aria-hidden="true"/)
      assert.equal((markup.match(/data-ff-signal=""/g) || []).length, 1)
      assert.match(markup, /Age 21 — not device battery level/)
      if (mode === 'fold') {
        assert.match(markup, /data-ff-screen-overlay="" inert="" aria-hidden="true"/)
        // One screen-only overlap covers the compositor edge, without widening the frame/glass.
        const bleed = port ? 'bottom:-1px' : 'right:-1px'
        assert.equal(markup.split(bleed).length - 1, 1)
        assert.ok(markup.includes(`background:linear-gradient(${port ? '180deg' : '90deg'}, #fff calc(100% - 1px), transparent calc(100% - 1px));overflow:hidden;contain:paint`))
      } else {
        assert.doesNotMatch(markup, /data-crease="1"/)
        assert.doesNotMatch(markup, /(?:right|bottom):-1px/)
      }
    }
  } finally { await vite.close() }
})

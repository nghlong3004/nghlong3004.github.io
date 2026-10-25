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

test('independent signal hooks jitter their timers, move one step, pause and clean up', () => {
  const previous = { window: globalThis.window, document: globalThis.document, __signalFixture: globalThis.__signalFixture }
  let next = 0, slot = 0
  const levels = [], cleanups = []
  const timers = new Map(), listeners = new Set()
  const document = { visibilityState: 'visible', addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) }
  const window = { setTimeout(fn, delay) { const id = ++next; timers.set(id, { fn, delay }); return id }, clearTimeout(id) { timers.delete(id) } }
  const f = { effects: [], state(initial) {
    const index = slot++
    levels[index] ??= initial
    return [levels[index], update => { levels[index] = update(levels[index]) }]
  } }
  Object.assign(globalThis, { window, document, __signalFixture: f })
  const oldRandom = Math.random
  Math.random = () => 0.25
  const tick = id => { const timer = timers.get(id); timers.delete(id); timer.fn() }
  try {
    assert.equal(useSignalLevel(true, 2000), 4)
    assert.equal(useSignalLevel(true, 5000), 4)
    cleanups.push(...f.effects.map(effect => effect()))
    assert.equal(timers.size, 2)
    assert.equal(listeners.size, 2)
    assert.deepEqual([...timers.values()].map(timer => timer.delay), [2250, 5625])
    const [cellular, wifi] = [...timers.keys()]
    Math.random = () => 0.99
    tick(cellular)
    assert.deepEqual(levels, [5, 4], 'cellular tick leaves Wi-Fi unchanged')
    assert.equal(timers.get(wifi).delay, 5625)
    assert.equal([...timers.values()].find(timer => timer.delay !== 5625).delay, 2990)
    tick([...timers.keys()].find(id => id !== wifi))
    assert.deepEqual(levels, [5, 4], 'cellular stays within its upper bound')
    Math.random = () => 0
    tick(wifi)
    assert.deepEqual(levels, [5, 3], 'Wi-Fi tick leaves cellular unchanged')
    for (let i = 0; i < 3; i++) tick([...timers.keys()].at(-1))
    assert.deepEqual(levels, [5, 2], 'Wi-Fi stays within its lower bound')
    document.visibilityState = 'hidden'; listeners.forEach(listener => listener())
    assert.equal(timers.size, 0)
    document.visibilityState = 'visible'; listeners.forEach(listener => listener())
    assert.deepEqual([...timers.values()].map(timer => timer.delay), [2000, 5000])
    cleanups.forEach(cleanup => cleanup())
    assert.equal(timers.size, 0)
    assert.equal(listeners.size, 0)
    f.effects = []
    slot = 0
    assert.equal(useSignalLevel(false, 2000), 5)
    assert.equal(useSignalLevel(false, 5000), 2)
    f.effects.forEach(effect => effect())
    assert.equal(timers.size, 0)
    assert.equal(listeners.size, 0)
    f.effects = []
    slot = 0
    document.visibilityState = 'hidden'
    useSignalLevel(true, 2000)
    useSignalLevel(true, 5000)
    cleanups.push(...f.effects.map(effect => effect()))
    assert.equal(timers.size, 0, 'remounting in a hidden tab does not start timers')
  } finally {
    cleanups.forEach(cleanup => cleanup()); Math.random = oldRandom
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
      screenOverlayNode: React.createElement('div', { role: 'dialog' }, 'overlay-marker'), signalLevel: 3, wifiLevel: 3 }
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

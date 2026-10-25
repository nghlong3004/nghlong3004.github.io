import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const rain = read('src/app/components/kokonut/RainGlassBackground.tsx')
const engine = read('src/features/foldfolio/FoldfolioDevice.tsx')

test('rain retains the official Kokonut shader, uses bounded drops and owns cleanup', () => {
  const hashes = {
    VERTEX: 'd7668059732332f14e0ade24c843f519b94db151f15071ca9cdcfbbc713bffbb',
    FRAGMENT: '1b3a58cd2ccc57aa7fa3339830be8427defdece53b1a9906f4a621011e73e5da',
  }
  for (const [name, hash] of Object.entries(hashes)) {
    const shader = rain.match(new RegExp('const ' + name + ' = `([\\s\\S]*?)`;'))[1]
    assert.equal(createHash('sha256').update(shader).digest('hex'), hash)
  }
  assert.doesNotMatch(rain, /unsplash|DEFAULT_SRC|DefaultContent|matchMedia/)
  assert.match(rain, /\.concat\(fresh\)\.slice\(0, MAX_DROPS\)/)
  assert.match(rain, /if \(!raf && visible && ready && !disposed\)/)
  for (const cleanup of ['image.onload = null', 'image.onerror = null', 'pane.destroy()', 'resizeObserver.disconnect()', 'intersection.disconnect()', 'clearInterval(colorTimer)', 'cancelAnimationFrame(raf)']) assert.ok(rain.includes(cleanup), cleanup)
  assert.match(rain, /removeEventListener\("webglcontextrestored", onContextRestored\)/)
})

test('none scene ignores stored scenes and changing finish preserves mixed preferences', () => {
  const start = engine.indexOf('        const next = { ...pick, ...p }')
  const end = engine.indexOf('\n    }\n    const scene', start)
  const choose = new Function('pick', 'p', 'sceneProp', 'setPick', 'window', 'STORE_KEY', 'STORE_EVENT', 'readStore', engine.slice(start, end))
  for (const scene of ['split', 'glow', 'orbit']) {
    const stored = { scene, finish: 'coral', custom: { keep: true } }
    let written
    choose({ scene: 'none', finish: 'coral' }, { finish: 'sage' }, 'none', () => {}, { localStorage: { setItem: (_, value) => { written = JSON.parse(value) } }, dispatchEvent() {} }, 'foldfolio:style', 'foldfolio:style', () => stored)
    assert.deepEqual(written, { ...stored, finish: 'sage' })
  }
  assert.match(engine, /scene: sceneProp === "none" \? "none" : s.scene \|\| sceneProp/)
  assert.match(engine, /const scene = sceneProp === "none" \? "none" : pick.scene/)
  assert.match(engine, /background: scene === "none" \? "transparent" : pageBg \|\| undefined/)
  const switcher = read('src/features/foldfolio/hooks/useSwitcher.tsx')
  assert.match(switcher, /switcher.show && scene !== "none" && scenesInHeader/)
  assert.match(switcher, /scene !== "none" && !scenesInHeader && scenePill/)
  assert.match(read('src/app/config/device.ts'), /scene: 'none'/)
  assert.equal(existsSync(new URL('../src/app/config/scenePreference.ts', import.meta.url)), false)
  assert.doesNotMatch(read('src/app/App.tsx'), /scenePreference|applyGlowDefault|sceneImages=|nameLeft=|nameRight=/)
})

test('background has no demo content, supports optional content, and uses one local app instance', async () => {
  const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
  try {
    const { default: RainGlassBackground } = await server.ssrLoadModule('/src/app/components/kokonut/RainGlassBackground.tsx')
    const html = renderToStaticMarkup(createElement(RainGlassBackground, { src: '/portrait/entry-wallpaper.jpg', interactive: false }))
    assert.equal((html.match(/<canvas/g) || []).length, 1)
    assert.doesNotMatch(html, /<h2|<a |cabins|Stay in|unsplash/i)
    assert.match(renderToStaticMarkup(createElement(RainGlassBackground, { src: '/portrait/entry-wallpaper.jpg', title: 'Rain' }, 'Content')), /Rain<\/h2>Content/)
    const app = read('src/app/App.tsx')
    assert.equal((app.match(/<RainGlassBackground\b/g) || []).length, 1)
    assert.match(app, /src=\{data.profile.portrait.src\} rain=\{0.6\} interactive=\{false\}/)
  } finally {
    await server.close()
  }
})

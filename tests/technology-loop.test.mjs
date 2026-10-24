import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { createTechnologyLoopController } from '../src/features/portfolio/hooks/technologyLoopController.ts'

function fixture() {
  let id = 0
  const pending = new Map()
  const controller = createTechnologyLoopController({
    request(callback) { pending.set(++id, callback); return id },
    cancel(id) { pending.delete(id) },
  })
  return { controller, pending, frame(now) {
    const callbacks = [...pending.values()]
    pending.clear()
    for (const callback of callbacks) callback(now)
  } }
}

test('one logical controller paints identical phase and intro to three copies at 100 layout px/s', () => {
  const f = fixture()
  const copies = [[], [], []]
  const releases = copies.map(copy => f.controller.register({ active: () => true, paint: frame => copy.push(frame) }))
  assert.equal(f.pending.size, 1)
  f.frame(1000)
  f.frame(1040)
  for (const copy of copies) assert.deepEqual(copy.at(-1), { distance: 4, intro: 0.04 / 0.7 })
  releases[0]()
  assert.equal(f.pending.size, 1)
  releases[1]()
  releases[2]()
  assert.equal(f.pending.size, 0)
})

test('hover/focus tokens pause all copies without overriding each other', () => {
  const f = fixture()
  const releases = Array.from({ length: 3 }, () => f.controller.register({ active: () => true, paint() {} }))
  const hover = Symbol('hover'), focus = Symbol('focus')
  f.controller.pause(hover, true)
  assert.equal(f.pending.size, 0)
  f.controller.pause(focus, true)
  f.controller.pause(hover, false)
  assert.equal(f.pending.size, 0)
  f.controller.pause(focus, false)
  assert.equal(f.pending.size, 1)
  for (const release of releases) release()
  assert.equal(f.pending.size, 0)
})

test('offscreen/hidden/inactive gating cancels RAF and resume resets dt; re-registration rearms', () => {
  const f = fixture()
  let active = true, latest
  const subscriber = { active: () => active, paint(frame) { latest = frame } }
  const release = f.controller.register(subscriber)
  f.frame(1000)
  f.frame(1050)
  assert.equal(latest.distance, 5)
  active = false
  f.controller.refresh()
  assert.equal(f.pending.size, 0)
  active = true
  f.controller.refresh()
  f.frame(100000)
  assert.equal(latest.distance, 5)
  f.frame(100020)
  assert.equal(latest.distance, 7)
  release()
  const releaseAgain = f.controller.register(subscriber)
  assert.equal(f.pending.size, 1)
  releaseAgain()
  f.controller.destroy()
  assert.equal(f.pending.size, 0)
})

test('two provider-owned controllers have independent state and long frames are bounded', () => {
  const a = fixture(), b = fixture()
  let latest
  a.controller.register({ active: () => true, paint(frame) { latest = frame } })
  b.controller.register({ active: () => true, paint() {} })
  a.frame(0)
  a.frame(5000)
  assert.equal(latest.distance, 5)
  a.controller.pause(Symbol('focus'), true)
  assert.equal(a.pending.size, 0)
  assert.equal(b.pending.size, 1)
  a.controller.destroy()
  b.controller.destroy()
})

test('bilingual wrapper and view wiring use real unique project technologies, no links, decorative inert repeats', async () => {
  const server = await createServer({
    configFile: false, cacheDir: '.taste-skill/evidence/local-followup/loop-followup/vite-cache',
    optimizeDeps: { noDiscovery: true, include: [] },
    server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom',
  })
  try {
    const { TechnologyLoop, TechnologyLoopProvider } = await server.ssrLoadModule('/src/features/portfolio/components/TechnologyLoop.tsx')
    const { HomeView } = await server.ssrLoadModule('/src/features/portfolio/components/views/HomeView.tsx')
    const { AboutView } = await server.ssrLoadModule('/src/features/portfolio/components/views/AboutView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const html = renderToStaticMarkup(createElement(TechnologyLoopProvider, null,
        createElement(TechnologyLoop, { technologies: ['React', 'React', 'Unmapped tool'], syncKey: 'test', language })))
      assert.equal((html.match(/<ul/g) ?? []).length, 2)
      assert.equal((html.match(/<li /g) ?? []).length, 4)
      assert.equal((html.match(/role="list"/g) ?? []).length, 2)
      assert.match(html, /<ul[^>]*aria-hidden="true" inert=""/)
      assert.doesNotMatch(html, /<button|aria-pressed|technology-loop__pause/)
      assert.equal((html.match(/tabindex="0"/g) ?? []).length, 1)
      assert.match(html, /role="region"[^>]*tabindex="0"/)
      assert.ok(html.includes(language === 'vi' ? 'Công nghệ trong các dự án' : 'Technologies used in projects'))
      assert.match(html, /technology-loop__fallback/)
      assert.match(html, /#61dafb/)
      assert.doesNotMatch(html, /<a\b|href=/)
      const assetHtml = renderToStaticMarkup(createElement(TechnologyLoopProvider, null,
        createElement(TechnologyLoop, { technologies: ['pLaYwRiGhT', 'Promptfoo'], syncKey: 'assets', language })))
      for (const name of ['playwright', 'promptfoo']) {
        assert.match(assetHtml, new RegExp(`<img[^>]*src="/technology/${name}\\.svg"[^>]*alt=""[^>]*aria-hidden="true"`))
      }
      assert.match(assetHtml, /technology-loop__name">pLaYwRiGhT</)
      assert.match(assetHtml, /technology-loop__name">Promptfoo</)
      assert.doesNotMatch(assetHtml, /technology-loop__fallback|<button|[•●]/)
      for (const [View, key] of [[HomeView, 'home'], [AboutView, 'about']]) {
        const tree = View({ data: portfolio[language] })
        const loops = []
        function visit(node) {
          if (Array.isArray(node)) return node.forEach(visit)
          if (!node?.props) return
          if (node.type === TechnologyLoop) loops.push(node.props)
          visit(node.props.children)
        }
        visit(tree)
        assert.equal(loops.length, 1)
        assert.equal(loops[0].syncKey, `${key}-technologies`)
        assert.deepEqual(loops[0].technologies, [...new Set(portfolio[language].projects.flatMap(p => p.techStack))])
        assert.equal(loops[0].language, language)
        const viewHtml = renderToStaticMarkup(createElement(TechnologyLoopProvider, null, tree))
        assert.equal((viewHtml.match(/data-technology-loop=/g) ?? []).length, 1)
        if (key === 'home') {
          assert.ok(viewHtml.indexOf('data-ff-section="capabilities"') < viewHtml.indexOf('data-ff-section="tools"'))
          assert.ok(viewHtml.indexOf('data-ff-section="tools"') < viewHtml.indexOf('data-ff-section="employment"'))
        }
      }
    }
    assert.equal(renderToStaticMarkup(createElement(TechnologyLoop, { technologies: [], syncKey: 'empty', language: 'en' })), '')
  } finally { await server.close() }
})

test('layout, lifecycle, provenance and explicit motion policy are retained in the adaptation', () => {
  const read = path => readFileSync(new URL(`../src/features/portfolio/${path}`, import.meta.url), 'utf8')
  const loop = read('components/reactbits/LogoLoop.tsx')
  const hook = read('hooks/useTechnologyLoop.tsx')
  const controller = read('hooks/technologyLoopController.ts')
  const css = read('styles/logo-loop.css') + read('styles/technology-loop.css')
  const license = read('components/reactbits/LICENSE.react-bits.txt')
  assert.match(loop, /e12c22192ac7b4b452c5e2feb9b586d74765d696/)
  assert.match(loop, /list.offsetWidth/)
  assert.match(loop, /element.clientWidth/)
  assert.doesNotMatch(loop, /getBoundingClientRect/)
  assert.match(hook, /visibilitychange/)
  assert.match(hook, /IntersectionObserver/)
  assert.match(hook, /MutationObserver/)
  assert.match(hook, /intersection\?\.disconnect/)
  assert.match(hook, /activity.disconnect/)
  assert.match(hook, /addEventListener\('focusin', focusIn\)/)
  assert.match(hook, /removeEventListener\('focusin', focusIn\)/)
  assert.match(hook, /current.pause\(focus, active\(\) && element.contains\(document.activeElement\)\)/)
  assert.doesNotMatch(loop + hook + controller + css, /manualPause|setManualPause|pauseLabel|resumeLabel|technology-loop__pause|snapshot\(|toggle\(/)
  assert.match(controller, /dt \* 100/)
  assert.doesNotMatch(css + hook + controller, /prefers-reduced-motion|matchMedia/)
  assert.match(css, /--logoloop-logoHeight: 48px/)
  assert.match(css, /--logoloop-gap: 56px/)
  assert.match(css, /\.portfolio-screen \.technology-loop \.logoloop__list \{ list-style: none; margin: 0; padding: 0; \}/)
  assert.match(css, /scale\(1.2\)/)
  assert.match(license, /MIT \+ Commons Clause License Condition v1.0/)
  assert.match(license, /Copyright \(c\) 2026 David Haz/)
})

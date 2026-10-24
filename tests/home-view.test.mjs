import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('Home renders real bilingual content in reference order without inline project details', async () => {
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { HomeView } = await server.ssrLoadModule('/src/features/portfolio/components/views/HomeView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const html = renderToStaticMarkup(createElement(HomeView, { data, expandedProject: 'vinqa', onNavigate() {}, onToggle() {} }))
      const sections = ['intro', 'impact', 'projects', 'capabilities', 'tools', 'employment', 'contact'].map(key => html.indexOf(`data-ff-section="${key}"`))
      assert.ok(sections.every((position, i) => position >= 0 && (i === 0 || position > sections[i - 1])))
      assert.ok(html.includes(data.profile.portrait.src) && html.includes(data.profile.portrait.alt))
      for (const item of data.impact) assert.ok(html.includes(item.value))
      for (const project of data.projects) {
        assert.ok(html.includes(`data-ff-section="project-${project.id}" tabindex="-1"`))
        assert.ok(html.includes(project.image.src))
        assert.ok(html.includes(project.title))
      }
      assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, data.projects.length)
      assert.equal((html.match(/aria-expanded="true"/g) || []).length, 1)
      assert.ok(!html.includes('aria-controls=') && !html.includes('role="dialog"'))
      for (const principle of data.story.principles) assert.ok(html.includes(principle.title))
      for (const job of data.experience) assert.ok(html.includes(job.company) && html.includes(job.logo))
      assert.ok(html.includes(language === 'vi' ? 'Tất cả dự án' : 'All projects'))
      assert.ok(!html.includes(language === 'vi' ? 'All projects' : 'Tất cả dự án'))
    }
  } finally { await server.close() }
})

test('Home uses controlled shared callbacks and isolated responsive styling', () => {
  const source = readFileSync(new URL('../src/features/portfolio/components/views/HomeView.tsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../src/features/portfolio/styles/home.css', import.meta.url), 'utf8')
  for (const destination of ['work', 'projects', 'experience', 'contact']) assert.ok(source.includes(`onNavigate('${destination}')`))
  assert.ok(source.includes('onToggle(project.id)'))
  assert.ok(source.includes('expandedProject === project.id'))
  assert.ok(source.includes("import '../../styles/home.css'"))
  assert.ok(css.includes('.portfolio-screen--compact .home-hero'))
  assert.ok(!/useState|scrollIntoView|dangerouslySetInnerHTML|from ['"].*data\//.test(source))
})

test('Home buttons invoke the shared navigation and selection handlers', async () => {
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { HomeView } = await server.ssrLoadModule('/src/features/portfolio/components/views/HomeView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    const calls = []
    const tree = HomeView({ data: portfolio.en, expandedProject: 'vinqa', onNavigate: destination => calls.push(['navigate', destination]), onToggle: id => calls.push(['project', id]) })
    function clickButtons(node) {
      if (Array.isArray(node)) return node.forEach(clickButtons)
      if (!node?.props) return
      if (node.type === 'button') node.props.onClick()
      clickButtons(node.props.children)
    }
    clickButtons(tree)
    assert.deepEqual(calls, [
      ['navigate', 'work'], ['navigate', 'contact'], ['navigate', 'projects'],
      ...portfolio.en.projects.map(project => ['project', project.id]),
      ['navigate', 'experience'], ['navigate', 'contact'],
    ])
  } finally { await server.close() }
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements)
  if (!node?.props) return []
  return [node, ...elements(node.props.children)]
}

function textMarkup(value) {
  return renderToStaticMarkup(createElement('span', null, value)).slice(6, -7)
}

test('Home SSR preserves real VI/EN content in exactly five ordered sections after its header', async () => {
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { HomeView } = await server.ssrLoadModule('/src/features/portfolio/components/views/HomeView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const props = { data, expandedProject: 'vinqa', onNavigate() {}, onToggle() {} }
      const tree = HomeView(props)
      const direct = tree.props.children.filter(Boolean)
      const keys = ['employment', 'tools', 'capabilities', 'projects', 'honors']
      assert.deepEqual(direct.map(node => node.type), ['header', ...keys.map(() => 'section'), 'footer'])
      const sections = direct.filter(node => node.type === 'section')
      assert.equal(sections.length, 5)
      assert.deepEqual(sections.map(node => node.props['data-ff-section']), keys)
      const html = renderToStaticMarkup(createElement(HomeView, props))
      assert.deepEqual([...html.matchAll(/<section\b[^>]*data-ff-section="([^"]+)"/g)].map(match => match[1]), keys)
      assert.ok(html.indexOf('<header') < html.indexOf('<section'))
      assert.equal((html.match(/<h1\b/g) || []).length, 1)
      assert.ok(html.includes(`aria-label="${textMarkup(data.profile.name)}"`))
      assert.ok(html.includes(textMarkup(data.profile.displayName)))
      assert.ok(html.includes(data.profile.portrait.src) && html.includes(data.profile.portrait.alt))
      assert.ok(!html.includes('data-ff-section="contact"'))
      assert.equal((html.match(/<footer\b/g) || []).length, 1)
      assert.ok(html.endsWith('</footer></div>'))
      assert.ok(html.includes(`data-framer-component-type="RichTextContainer"><h2>${textMarkup(data.ui.contactHeading)}</h2></div>`))
      assert.ok(html.includes(`<p>${textMarkup(data.ui.contactIntro)}</p>`))
      assert.equal((html.match(/data-framer-component-type="RichTextContainer"/g) || []).length, 7 + data.projects.length)
      assert.equal((html.match(/data-framer-background-image-wrapper="true"/g) || []).length, 1 + data.projects.length)

      const honors = renderToStaticMarkup(sections.at(-1))
      assert.ok(honors.includes(`<h2>${textMarkup(data.ui.honors)}</h2>`))
      assert.equal((honors.match(/<li>/g) || []).length, data.honors.length)
      for (const honor of data.honors) {
        for (const value of [honor.name, honor.period, honor.description]) assert.ok(honors.includes(textMarkup(value)))
      }
      assert.equal((honors.match(/data-framer-name="Count impact"/g) || []).length, data.impact.length)
      for (const item of data.impact) {
        assert.ok(honors.includes(`>${textMarkup(item.value)}</dt><dd>${textMarkup(item.label)}</dd>`))
      }
      assert.ok(honors.indexOf('data-ff-section="impact"') > honors.indexOf('</ul>'))
      assert.ok(!renderToStaticMarkup(sections.slice(0, -1)).includes('data-framer-name="Count impact"'))
      assert.ok(honors.includes('data-ff-surface="true"') || honors.includes('data-ff-surface=""'))
      for (const project of data.projects) {
        assert.ok(html.includes(`data-ff-section="project-${project.id}" tabindex="-1"`))
        assert.ok(html.includes(project.image.src))
        for (const value of [project.title, project.summary, project.category, project.year, project.image.alt]) assert.ok(html.includes(textMarkup(value)))
      }
      assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, data.projects.length)
      assert.equal((html.match(/aria-expanded="true"/g) || []).length, 1)
      assert.ok(!html.includes('aria-controls=') && !html.includes('role="dialog"'))
      for (const principle of data.story.principles) {
        assert.ok(html.includes(textMarkup(principle.title)) && html.includes(textMarkup(principle.body)))
      }
      for (const job of data.experience) {
        for (const value of [job.company, job.role, job.period, job.logo]) assert.ok(html.includes(textMarkup(value)))
      }
      const loop = elements(tree).find(node => node.props.syncKey === 'home-technologies')
      const technologies = [...new Set(data.projects.flatMap(project => project.techStack))]
      assert.deepEqual(loop.props.technologies, technologies)
      assert.equal(loop.props.language, language)
      for (const excluded of ['OAuth2/JWT', 'WebSocket', 'A* Pathfinding']) assert.ok(!technologies.includes(excluded))
      assert.ok(html.includes(language === 'vi' ? 'Công nghệ sử dụng' : 'Project technologies'))
      assert.ok(html.includes(language === 'vi' ? 'Công nghệ trong các dự án' : 'Technologies used in projects'))
      assert.ok(html.includes(language === 'vi' ? 'Tất cả dự án' : 'All projects'))
      assert.ok(!html.includes(language === 'vi' ? 'All projects' : 'Tất cả dự án'))
    }
  } finally { await server.close() }
})

test('Home uses controlled shared callbacks and isolated responsive styling', () => {
  const source = readFileSync(new URL('../src/features/portfolio/components/views/HomeView.tsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../src/features/portfolio/styles/home.css', import.meta.url), 'utf8')
  for (const destination of ['work', 'projects', 'contact']) assert.ok(source.includes(`onNavigate('${destination}')`))
  assert.ok(!source.includes("onNavigate('experience')"))
  assert.ok(source.includes('onToggle(project.id)'))
  assert.ok(source.includes('expandedProject === project.id'))
  assert.ok(source.includes("import '../../styles/home.css'"))
  assert.ok(css.includes('.portfolio-screen--compact .home-hero'))
  assert.ok(css.includes('.portfolio-screen--compact .home-honors__list li'))
  assert.ok(css.includes('.home-tools__heading { white-space: nowrap; }'))
  assert.ok(!css.includes('.home-contact'))
  assert.ok(!/useState|useEffect|TechnologyLoopProvider|ProjectOverlay|scrollIntoView|dangerouslySetInnerHTML|from ['"].*data\//.test(source))
})

test('Home buttons invoke the shared navigation and selection handlers', async () => {
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { HomeView } = await server.ssrLoadModule('/src/features/portfolio/components/views/HomeView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const calls = []
      const props = { data, expandedProject: 'vinqa', onNavigate: destination => calls.push(['navigate', destination]), onToggle: id => calls.push(['project', id]) }
      const tree = HomeView(props)
      const buttons = elements(tree).filter(node => node.type === 'button')
      buttons.forEach(button => button.props.onClick())
      assert.deepEqual(calls, [
        ['navigate', 'projects'], ['navigate', 'contact'], ['navigate', 'work'], ['navigate', 'projects'],
        ...data.projects.map(project => ['project', project.id]),
        ['navigate', 'contact'],
      ])
      const footerCalls = []
      const footerTree = HomeView({ ...props, onNavigate: destination => footerCalls.push(destination) })
      const footer = elements(footerTree).find(node => node.type === 'footer')
      const footerButtons = elements(footer).filter(node => node.type === 'button')
      assert.equal(footerButtons.length, 1)
      footerButtons[0].props.onClick()
      assert.deepEqual(footerCalls, ['contact'])
      for (const expandedProject of [null, ...data.projects.map(project => project.id)]) {
        const triggers = elements(HomeView({ ...props, expandedProject })).filter(node => node.props['aria-haspopup'] === 'dialog')
        assert.deepEqual(triggers.map(node => node.props['aria-expanded']), data.projects.map(project => project.id === expandedProject))
      }
    }
  } finally { await server.close() }
})

test('Home employer summaries expose only company, role, period and logo, never job details', async () => {
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { HomeView } = await server.ssrLoadModule('/src/features/portfolio/components/views/HomeView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const current = data.experience.find(job => job.current)
      assert.equal(current.company, 'VinFast')
      assert.equal(current.role, language === 'vi' ? 'Đang làm việc tại VinFast' : 'Currently working at VinFast')
      assert.deepEqual(current.tech, [])
      assert.deepEqual(current.highlights, [])
      const props = { data, expandedProject: null, onNavigate() {}, onToggle() {} }
      const safe = renderToStaticMarkup(createElement(HomeView, props))
      const extraDetails = {
        ...data,
        experience: data.experience.map(job => ({ ...job, tech: ['PRIVATE_TECH_SENTINEL'], highlights: ['PRIVATE_DETAIL_SENTINEL'] })),
      }
      assert.equal(renderToStaticMarkup(createElement(HomeView, { ...props, data: extraDetails })), safe)
      const employers = elements(HomeView(props)).filter(node => node.props.className === 'home-employer')
      assert.equal(employers.length, data.experience.length)
      employers.forEach((employer, index) => {
        const job = data.experience[index]
        const text = elements(employer).filter(node => ['h3', 'p'].includes(node.type)).map(node => node.props.children)
        assert.deepEqual(text, [job.company, job.role, job.period])
      })
    }
  } finally { await server.close() }
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync, existsSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

function elements(node) {
  if (!node || typeof node !== 'object') return []
  if (Array.isArray(node)) return node.flatMap(elements)
  return [node, ...elements(node.props?.children)]
}

test('Projects archive uses actual bilingual imagery, unique targets and shared callbacks', async () => {
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { ProjectsView } = await server.ssrLoadModule('/src/features/portfolio/components/views/ProjectsView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const toggles = [], destinations = []
      const props = { data, expandedProject: 'vinqa', onToggle: id => toggles.push(id), onNavigate: destination => destinations.push(destination), workFilter: 'all', onWorkFilterChange() {}, contactDraft: { name: '', email: '', location: '', message: '' }, onContactDraftChange() {} }
      const tree = ProjectsView(props)
      const all = elements(tree)
      const html = renderToStaticMarkup(createElement(ProjectsView, props))
      assert.ok(html.includes('pf-page pf-page--dark pf-projects'))
      assert.ok(html.includes(`<h1>${data.ui.archive}</h1>`))
      assert.ok(!html.includes('data-ff-section="impact"') && !html.includes('data-ff-section="experience"'))
      assert.ok(!html.includes('Red Wall') && !html.includes('Rotterdam'))
      const images = all.filter(node => node.type === 'img')
      const expected = data.projects.flatMap(project => [...new Set([project.image.src, ...project.images])])
      assert.equal(images.length, expected.length)
      assert.deepEqual(images.map(node => node.props.src).sort(), expected.sort())
      for (const image of images) {
        assert.ok(existsSync(new URL(`../public${image.props.src}`, import.meta.url)))
        assert.ok(image.props.alt.length > 0)
      }
      const buttons = all.filter(node => node.type === 'button' && node.props['aria-haspopup'] === 'dialog')
      assert.equal(buttons.length, images.length)
      // The first row represents all four projects before their additional gallery images.
      buttons.slice(0, data.projects.length).forEach((button, index) => {
        button.props.onClick()
        assert.equal(toggles.at(-1), data.projects[index].id)
      })
      for (const project of data.projects) {
        assert.equal(all.filter(node => node.props?.['data-ff-section'] === `project-${project.id}`).length, 1)
        const projectButtons = buttons.filter(node => node.props['aria-label'].includes(`: ${project.title} —`))
        assert.ok(projectButtons.length)
        for (const button of projectButtons) {
          assert.equal(button.props['aria-expanded'], project.id === 'vinqa')
          button.props.onClick()
          assert.equal(toggles.at(-1), project.id)
        }
        assert.ok(html.includes(project.category) && html.includes(project.year))
      }
      all.find(node => node.type === 'button' && !node.props['aria-haspopup']).props.onClick()
      assert.deepEqual(destinations, ['contact'])
      const unselected = elements(ProjectsView({ ...props, expandedProject: null }))
      assert.ok(unselected.filter(node => node.type === 'button' && node.props['aria-haspopup']).every(node => node.props['aria-expanded'] === false))
    }
  } finally { await server.close() }
})

test('Projects owns its stylesheet and reference 4/2/1 responsive grid without shared mutations', () => {
  const source = readFileSync(new URL('../src/features/portfolio/components/views/ProjectsView.tsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../src/features/portfolio/styles/projects.css', import.meta.url), 'utf8')
  assert.match(source, /import type \{ PortfolioViewProps \}/)
  assert.match(source, /import '\.\.\/\.\.\/styles\/projects\.css'/)
  assert.ok(!source.includes('useState') && !source.includes('scrollIntoView') && !source.includes('from \'../../data/'))
  assert.match(css, /repeat\(4, minmax\(0, 1fr\)\)/)
  assert.match(css, /repeat\(2, minmax\(0, 1fr\)\)/)
  assert.match(css, /\.portfolio-screen--compact \.pf-projects__gallery \{ grid-template-columns: minmax\(0, 1fr\)/)
  assert.match(css, /object-fit: contain/)
  assert.match(css, /:focus-visible/)
  assert.ok(!css.includes('prefers-reduced-motion'))
})

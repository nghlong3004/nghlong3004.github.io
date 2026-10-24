import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('Work renders real bilingual projects, stable controlled filters and overlay triggers', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { WorkView } = await server.ssrLoadModule('/src/features/portfolio/components/views/WorkView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    const nodes = element => !element || typeof element !== 'object' ? [] : [element, ...[element.props?.children].flat(Infinity).flatMap(nodes)]
    for (const language of ['vi', 'en']) {
      const data = portfolio[language], toggles = [], filters = [], destinations = []
      const props = { data, expandedProject: 'vinqa', workFilter: 'all', onToggle: id => toggles.push(id), onNavigate: destination => destinations.push(destination), onWorkFilterChange: value => filters.push(value), contactDraft: { name: '', email: '', location: '', message: '' }, onContactDraftChange() {} }
      const html = renderToStaticMarkup(createElement(WorkView, props))
      assert.match(html, new RegExp(`<h1>${data.ui.work}</h1>`))
      assert.equal((html.match(/<article /g) || []).length, 4)
      assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 8)
      assert.ok(!html.includes('aria-controls') && !html.includes('portfolio-project__details'))
      assert.equal((html.match(/<dt data-framer-name="Count impact">/g) || []).length, 4)
      for (const project of data.projects) {
        assert.ok(html.includes(`data-ff-section="project-${project.id}"`))
        assert.ok(html.includes(project.image.src) && html.includes(project.category) && html.includes(project.outcome))
      }
      const tree = nodes(WorkView(props))
      for (const button of tree.filter(node => node.props?.['aria-haspopup'] === 'dialog')) button.props.onClick()
      assert.deepEqual(toggles, [...data.projects, ...data.projects].map(project => project.id))
      for (const button of tree.filter(node => node.type === 'button' && typeof node.props['aria-pressed'] === 'boolean')) button.props.onClick()
      assert.deepEqual(filters, ['all', ...data.projects.map(project => project.id)])
      tree.find(node => node.type === 'button' && !node.props['aria-haspopup'] && node.props['aria-pressed'] === undefined).props.onClick()
      assert.deepEqual(destinations, ['contact'])
      for (const project of data.projects) {
        const filtered = renderToStaticMarkup(createElement(WorkView, { ...props, workFilter: project.id }))
        assert.equal((filtered.match(/<article /g) || []).length, 1)
        assert.equal((filtered.match(/aria-haspopup="dialog"/g) || []).length, 2)
        assert.ok(filtered.includes(`data-ff-section="project-${project.id}"`))
        assert.match(filtered, /aria-pressed="true"/)
      }
      const fallback = renderToStaticMarkup(createElement(WorkView, { ...props, workFilter: 'unknown' }))
      assert.equal((fallback.match(/<article /g) || []).length, 4)
    }
  } finally { await server.close() }
})

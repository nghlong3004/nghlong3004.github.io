import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { resolvePortfolioDestination } from '../src/features/portfolio/lib/navigation.ts'

test('navigation resolves genuine views and optional deep targets, not cross-view anchors', () => {
  assert.deepEqual(resolvePortfolioDestination('intro'), { view: 'about' })
  assert.deepEqual(resolvePortfolioDestination('about'), { view: 'about' })
  assert.deepEqual(resolvePortfolioDestination('work'), { view: 'work' })
  assert.deepEqual(resolvePortfolioDestination('projects'), { view: 'work' })
  assert.deepEqual(resolvePortfolioDestination('experience'), { view: 'experience' })
  assert.deepEqual(resolvePortfolioDestination('contact'), { view: 'contact' })
  assert.deepEqual(resolvePortfolioDestination('job-current'), { view: 'experience', target: 'job-current' })
  assert.deepEqual(resolvePortfolioDestination('project-vinqa'), { view: 'work', target: 'project-vinqa', project: 'vinqa' })
  assert.deepEqual(resolvePortfolioDestination('unrecognized'), { view: 'about' })
})

test('actual VI/EN view markup contains only the active destination and its approved groups', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { PortfolioScreen } = await server.ssrLoadModule('/src/features/portfolio/components/PortfolioScreen.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    const { entryPortrait } = await server.ssrLoadModule('/src/features/portfolio/data/portrait.ts')
    const { PortfolioCover } = await server.ssrLoadModule('/src/features/portfolio/components/PortfolioCover.tsx')
    const groups = { about: ['intro', 'story'], work: ['projects', 'impact'], experience: ['experience', 'honors'], contact: ['contact'] }
    for (const language of ['vi', 'en']) for (const [view, sections] of Object.entries(groups)) {
      const html = renderToStaticMarkup(createElement(PortfolioScreen, { data: portfolio[language], view, launch: true, expandedProject: 'vinqa', onToggle() {}, onNavigate() {} }))
      assert.ok(html.includes(`data-portfolio-view="${view}"`))
      assert.ok(html.includes('data-ff-section="view-root"'))
      for (const key of Object.values(groups).flat()) assert.equal(html.includes(`data-ff-section="${key}"`), sections.includes(key), `${language}/${view}/${key}`)
      assert.equal(html.includes('data-ff-section="project-vinqa"'), view === 'work')
      assert.equal(html.includes('data-ff-section="job-current"'), view === 'experience')
      if (view === 'work') assert.ok(html.includes('aria-expanded="true"'))
      if (view === 'about') assert.ok(html.includes('data-mark') && html.includes(portfolio[language].profile.intro))
      if (view === 'about') assert.ok(html.includes('/portrait/reference.jpg') && !html.includes(entryPortrait.src))
      assert.ok(html.includes('role="region"') && html.includes('tabindex="-1"'))
    }
    for (const compact of [false, true]) {
      const html = renderToStaticMarkup(createElement(PortfolioCover, { data: portfolio.en, portrait: entryPortrait, compact, time: '12:34', onNavigate() {} }))
      assert.ok(html.includes(`src="${entryPortrait.src}"`) && html.includes(entryPortrait.alt))
      assert.ok(html.includes('object-fit:cover') && !html.includes('viewBox="610'))
    }
  } finally { await server.close() }
})

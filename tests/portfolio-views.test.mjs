import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { resolvePortfolioDestination } from '../src/features/portfolio/lib/navigation.ts'

test('navigation resolves genuine views and optional deep targets, not cross-view anchors', () => {
  assert.deepEqual(resolvePortfolioDestination('intro'), { view: 'home' })
  assert.deepEqual(resolvePortfolioDestination('home'), { view: 'home' })
  assert.deepEqual(resolvePortfolioDestination('about'), { view: 'about' })
  assert.deepEqual(resolvePortfolioDestination('work'), { view: 'work' })
  assert.deepEqual(resolvePortfolioDestination('projects'), { view: 'projects' })
  assert.deepEqual(resolvePortfolioDestination('experience'), { view: 'experience' })
  assert.deepEqual(resolvePortfolioDestination('contact'), { view: 'contact' })
  assert.deepEqual(resolvePortfolioDestination('job-current'), { view: 'experience', target: 'job-current' })
  assert.deepEqual(resolvePortfolioDestination('project-vinqa'), { view: 'projects', target: 'project-vinqa', project: 'vinqa' })
  assert.deepEqual(resolvePortfolioDestination('project-'), { view: 'home' })
  assert.deepEqual(resolvePortfolioDestination('unrecognized'), { view: 'home' })
})

test('App navigation selects notifications, clears selection only when leaving, and returns Home', () => {
  const source = readFileSync(new URL('../src/app/App.tsx', import.meta.url), 'utf8')
  const body = source.match(/const navigate = \(destination: string\) => \{([\s\S]*?)\n  \}/)[1]
  let navigation = { view: 'projects', revision: 2, open: true }, selected = 'vinqa'
  const navigate = destination => new Function('destination', 'window', 'entryFrame', 'resolvePortfolioDestination', 'navigation', 'setExpandedProject', 'setNavigation', body)(
    destination, { cancelAnimationFrame() {} }, { current: 0 }, resolvePortfolioDestination, navigation,
    value => { selected = value }, update => { navigation = update(navigation) },
  )
  navigate('projects')
  assert.equal(selected, 'vinqa')
  navigate('work')
  assert.equal(selected, null)
  navigate('project-vinqa')
  assert.equal(selected, 'vinqa')
  assert.deepEqual(navigation, { view: 'projects', target: 'project-vinqa', revision: 5, open: true })
  navigate('job-current')
  assert.equal(selected, null)
  assert.equal(navigation.view, 'experience')
  assert.ok(source.includes("({ view: 'home', revision: 0, open: false })"))
  assert.match(source, /const returnToEntry[\s\S]*?setExpandedProject\(null\)[\s\S]*?view: 'home'/)
  assert.equal((source.match(/onClick=\{\(\) => setLanguage\('/g) || []).length, 2)
  assert.ok(!/useEffect\([^]*?setExpandedProject/.test(source.split('const navigate')[0]))
  const nav = source.slice(source.indexOf('nav={<nav'))
  assert.deepEqual([...nav.matchAll(/\['(home|work|projects|about|experience|contact)',/g)].map(match => match[1]), ['home', 'work', 'projects', 'about', 'contact'])
  for (const prop of ['workFilter={workFilter}', 'onWorkFilterChange={setWorkFilter}', 'contactDraft={contactDraft}', 'onContactDraftChange={changeContactDraft}']) assert.equal(source.split(prop).length - 1, 2)
})

test('shared CSS primitives keep reference geometry and only notification image backing transparent', () => {
  const css = readFileSync(new URL('../src/features/portfolio/styles/portfolio.css', import.meta.url), 'utf8')
  for (const name of ['pf-page', 'pf-header', 'pf-section', 'pf-action', 'pf-metrics']) assert.ok(css.includes(`.${name}`))
  assert.match(css, /--pf-padding: 29px/)
  assert.match(css, /--pf-padding: 26px/)
  assert.match(css, /\.portfolio-notification__app \{[^}]*background: transparent/)
  assert.match(css, /\.portfolio-notification \{[^}]*background: rgba\(255,255,255,\.72\)/)
})

test('actual VI/EN view markup contains only the active destination and its approved groups', async () => {
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { PortfolioScreen } = await server.ssrLoadModule('/src/features/portfolio/components/PortfolioScreen.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    const { PortfolioCover } = await server.ssrLoadModule('/src/features/portfolio/components/PortfolioCover.tsx')
    const { PortfolioContact } = await server.ssrLoadModule('/src/features/portfolio/components/PortfolioContact.tsx')
    const groups = { home: ['intro', 'impact', 'projects', 'capabilities', 'employment', 'contact'], about: ['intro', 'story', 'about-impact', 'about-capabilities', 'about-honors', 'about-employers', 'about-contact'], work: ['projects', 'impact'], projects: ['projects'], experience: ['experience', 'honors'], contact: ['contact'] }
    for (const language of ['vi', 'en']) for (const [view, sections] of Object.entries(groups)) {
      const html = renderToStaticMarkup(createElement(PortfolioScreen, { data: portfolio[language], view, launch: true, expandedProject: 'vinqa', onToggle() {}, onNavigate() {}, workFilter: 'all', onWorkFilterChange() {}, contactDraft: { name: '', email: '', location: '', message: '' }, onContactDraftChange() {} }))
      assert.ok(html.includes(`data-portfolio-view="${view}"`))
      assert.ok(html.includes('data-ff-section="view-root"'))
      for (const key of Object.values(groups).flat()) assert.equal(html.includes(`data-ff-section="${key}"`), sections.includes(key), `${language}/${view}/${key}`)
      assert.equal(html.includes('data-ff-section="project-vinqa"'), ['home', 'work', 'projects'].includes(view))
      assert.equal(html.includes('data-ff-section="job-current"'), view === 'experience')
      if (['home', 'work', 'projects'].includes(view)) {
        assert.ok(html.includes('aria-haspopup="dialog"'))
        assert.ok(!html.includes('portfolio-project__details'))
      }
      if (view === 'about') assert.ok(html.includes('data-mark') && html.includes(portfolio[language].profile.intro))
      if (view === 'about') assert.ok(html.includes(portfolio[language].profile.portrait.src) && html.includes(portfolio[language].profile.portrait.alt) && !html.includes('/portrait/reference.jpg'))
      assert.ok(html.includes('role="region"') && html.includes('tabindex="-1"'))
      if (view === 'home' || view === 'about') assert.ok(html.includes(portfolio[language].ui.experience))
    }
    for (const language of ['vi', 'en']) for (const compact of [false, true]) {
      const portrait = portfolio[language].profile.portrait
      for (const [Component, extra] of [[PortfolioCover, { time: '12:34', onNavigate() {} }], [PortfolioContact, { onReturnToEntry() {} }]]) {
        const html = renderToStaticMarkup(createElement(Component, { data: portfolio[language], compact, ...extra }))
        assert.ok(html.includes(`src="${portrait.src}"`) && html.includes(portrait.alt))
        assert.ok(!html.includes('/portrait/reference.jpg') && !html.includes('viewBox="610'))
      }
    }
  } finally { await server.close() }
})

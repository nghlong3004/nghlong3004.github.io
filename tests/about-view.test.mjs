import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('About renders the complete real bilingual introduction, results, principles, honors and employers', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { AboutView } = await server.ssrLoadModule('/src/features/portfolio/components/views/AboutView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    const plain = html => html.replace(/<[^>]*>/g, '').replaceAll('&#x27;', "'").replaceAll('&amp;', '&').replaceAll('&quot;', '"')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const html = renderToStaticMarkup(createElement(AboutView, { data, onNavigate() {}, expandedProject: null, onToggle() {}, workFilter: 'all', onWorkFilterChange() {}, contactDraft: { name: '', email: '', location: '', message: '' }, onContactDraftChange() {} }))
      const text = plain(html)
      for (const value of [data.profile.name, data.profile.role, data.profile.intro, data.profile.bio, data.story.intro, data.profile.location, data.ui.contactHeading, data.ui.contactIntro]) assert.ok(text.includes(value), `${language}: ${value}`)
      for (const metric of data.impact) for (const value of [metric.value, metric.label]) assert.ok(text.includes(value))
      for (const principle of data.story.principles) for (const value of [principle.title, principle.body]) assert.ok(text.includes(value))
      for (const honor of data.honors) for (const value of [honor.name, honor.period, honor.description]) assert.ok(text.includes(value))
      for (const job of data.experience) for (const value of [job.company, job.role, job.period]) assert.ok(text.includes(value))
      for (const technology of new Set(data.projects.flatMap(project => project.techStack))) assert.ok(text.includes(technology))
      assert.equal((html.match(/<h1/g) || []).length, 1)
      assert.equal((html.match(/class="pf-card-title"/g) || []).length, data.story.principles.length + data.honors.length + data.experience.length)
      assert.ok(html.indexOf(data.profile.portrait.src) < html.indexOf('<h1'))
      assert.ok(html.includes(data.profile.portrait.alt) && html.includes('data-mark'))
      assert.ok(!html.includes('/portrait/reference.jpg') && !html.includes('Lio Maren') && !html.includes('ADC Awards'))
      assert.ok(text.includes(language === 'vi' ? 'CÁCH MÌNH LÀM' : 'HOW I BUILD'))
    }
  } finally { await server.close() }
})

test('About uses the shared props, controlled official MarkerText and isolated responsive stylesheet', () => {
  const source = readFileSync(new URL('../src/features/portfolio/components/views/AboutView.tsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../src/features/portfolio/styles/about.css', import.meta.url), 'utf8')
  assert.match(source, /import type \{ PortfolioViewProps \}/)
  assert.match(source, /import '\.\.\/\.\.\/styles\/about\.css'/)
  assert.match(source, /<MarkerText as="p" show>/)
  assert.match(source, /onNavigate\('experience'\)/)
  assert.equal((source.match(/onNavigate\('contact'\)/g) || []).length, 2)
  assert.ok(!/useState|scrollIntoView|window\.|from ['"].*\/data\//.test(source))
  assert.match(css, /grid-template-columns: 46\.5% minmax\(0, 1fr\)/)
  assert.match(css, /\.portfolio-screen--compact \.about-view__hero \{ grid-template-columns: 1fr/)
  for (const rule of css.split('\n').filter(line => line.includes('{'))) assert.ok(rule.startsWith('.portfolio-screen'), rule)
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('Work renders only real bilingual employment history and preserves the current-job target', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { WorkView } = await server.ssrLoadModule('/src/features/portfolio/components/views/WorkView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    const escape = text => renderToStaticMarkup(createElement('span', null, text)).slice(6, -7)
    const unused = () => assert.fail('Employment-only Work must not call shared interaction callbacks')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const props = { data, expandedProject: 'vinqa', workFilter: 'vinqa', onToggle: unused, onNavigate: unused, onWorkFilterChange: unused }
      const html = renderToStaticMarkup(createElement(WorkView, props))
      assert.equal((html.match(/<h1>/g) || []).length, 1)
      assert.ok(html.includes(`<h1>${escape(data.ui.work)}</h1>`))
      assert.match(html, /class="pf-page pf-work" data-ff-surface="true"/)
      assert.match(html, /data-framer-component-type="RichTextContainer"><h1>/)
      assert.ok(html.includes(language === 'vi'
        ? 'Nơi tôi đang làm việc và kinh nghiệm từ kỳ thực tập trước đây.'
        : 'Where I work now and experience from my previous internship.'))
      assert.equal((html.match(/<article /g) || []).length, data.experience.length)
      assert.equal((html.match(/<section /g) || []).length, 1)
      assert.ok(html.includes(`data-ff-section="experience" aria-label="${escape(data.ui.experience)}"`))
      for (const job of data.experience) {
        assert.ok(html.includes(`aria-label="${escape(job.company)}"`))
        assert.ok(html.includes(`<h3>${escape(job.company)}</h3>`))
        assert.ok(html.includes(`<h4>${escape(job.role)}</h4>`))
        if (job.logo) assert.ok(html.includes(`src="${job.logo}"`))
        if (!job.current) {
          assert.ok(html.includes(escape(job.period)))
          for (const highlight of job.highlights) assert.ok(html.includes(`<li>${escape(highlight)}</li>`))
          assert.ok(html.includes(escape(job.tech.join(' / '))))
        }
      }
      const current = html.match(/<article [^>]*data-ff-section="job-current"[^>]*>.*?<\/article>/g) || []
      assert.equal(current.length, 1)
      assert.match(current[0], /tabindex="-1" aria-label="VinFast"/)
      assert.ok(current[0].includes(language === 'vi' ? 'Đang làm việc tại VinFast' : 'Currently working at VinFast'))
      assert.doesNotMatch(current[0], /<ul|portfolio-tech|portfolio-meta/)
      assert.doesNotMatch(html, /<button|<dialog|<dl|<dt|<form|aria-haspopup|aria-pressed|Count|pf-work__(?:filters|grid|index|metrics|contact)|data-ff-section="(?:project[^"]*|impact|honors|contact)"/)
      for (const project of data.projects) {
        assert.ok(!html.includes(escape(project.title)))
        assert.ok(!html.includes(project.image.src))
      }
      for (const honor of data.honors) assert.ok(!html.includes(escape(honor.name)))
      for (const stat of data.impact) assert.ok(!html.includes(escape(stat.label)))
      // Independent datasets are not inputs to employment rendering while shared props stay frozen.
      const employmentOnly = { ui: data.ui, experience: data.experience }
      assert.equal(renderToStaticMarkup(createElement(WorkView, { ...props, data: employmentOnly })), html)
      assert.equal(renderToStaticMarkup(createElement(WorkView, { ...props, workFilter: 'all', expandedProject: null })), html)
    }
  } finally { await server.close() }
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('Work uses one full-bleed dark field and identical contained adjacent logo grids', () => {
  const css = readFileSync(new URL('../src/features/portfolio/styles/work.css', import.meta.url), 'utf8')
  const history = css.match(/\.portfolio-screen \.pf-work \.work-history\s*\{([^}]+)\}/)?.[1]
  assert.match(history, /background:\s*var\(--pf-dark\)/)
  assert.match(history, /color:\s*var\(--pf-on-dark\)/)
  assert.match(history, /margin-inline:\s*calc\(-1 \* var\(--pf-padding\)\)/)
  assert.match(history, /padding:\s*40px var\(--pf-padding\)/)
  const header = css.match(/\.portfolio-screen \.pf-work \.work-record__header\s*\{([^}]+)\}/)?.[1]
  assert.match(header, /display:\s*grid/)
  assert.match(header, /grid-template-columns:\s*96px minmax\(0, 1fr\)/)
  const logo = css.match(/\.portfolio-screen \.pf-work \.work-record__logo\s*\{([^}]+)\}/)?.[1]
  assert.match(logo, /object-fit:\s*contain/)
  assert.match(logo, /background:\s*var\(--pf-ground\)/)
  assert.doesNotMatch(css, /work-record--(?:current|past)\s*\{|(?:filter|mix-blend-mode)\s*:/)
  assert.match(css, /work-record:focus-visible\s*\{[^}]*outline:\s*2px solid currentColor/)
  assert.doesNotMatch(css, /210px|(?:box-shadow|border-radius|min-height)\s*:/)
})

test('Work renders only real bilingual employment history and preserves the current-job target', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { WorkView } = await server.ssrLoadModule('/src/features/portfolio/components/views/WorkView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    const escape = text => renderToStaticMarkup(createElement('span', null, text)).slice(6, -7)
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const calls = []
      const props = { data, expandedProject: 'vinqa', workFilter: 'vinqa', onToggle: () => assert.fail('Work does not open projects'), onNavigate: destination => calls.push(destination), onWorkFilterChange: () => assert.fail('Work has no project filter') }
      const tree = WorkView(props)
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
      assert.equal((html.match(/<footer\b/g) || []).length, 1)
      assert.equal((html.match(/<button\b/g) || []).length, 1)
      assert.ok(html.endsWith('</footer></div>'))
      assert.ok(html.includes(`data-framer-component-type="RichTextContainer"><h2>${escape(data.ui.contactHeading)}</h2></div>`))
      assert.ok(html.includes(`>${escape(data.ui.contact)}<svg`))
      assert.ok(html.includes(`<p>${escape(data.ui.contactIntro)}</p>`))
      assert.ok(html.includes(`data-ff-section="experience" aria-label="${escape(data.ui.experience)}"`))
      assert.match(html, /<section class="work-history" data-ff-surface="true"/)
      for (const job of data.experience) {
        const article = (html.match(/<article\b[^>]*>.*?<\/article>/g) || []).find(markup => markup.includes(`aria-label="${escape(job.company)}"`))
        assert.ok(article, 'every employer has its own named article')
        assert.doesNotMatch(article, /^<article\b[^>]*\bdata-ff-surface/, 'both records inherit the dark history without sampling logo luminance')
        assert.ok(article.includes(`<h2>${escape(job.company)}</h2>`), 'company is a section heading')
        if (job.logo) {
          assert.match(article, /<header class="work-record__header"><img class="work-record__logo"/)
          assert.ok(article.includes(`src="${job.logo}" alt="${escape(job.company)}" width="96" height="96"`))
          assert.ok(article.indexOf('<img ') < article.indexOf('work-record__identity'), 'original logo immediately precedes company identity')
        }
        if (!job.current) {
          assert.match(article, /work-record--past/)
          assert.ok(article.includes(`<h3>${escape(job.role)}</h3>`), 'historical role follows company in the heading hierarchy')
          assert.ok(article.includes(escape(job.period)))
          for (const highlight of job.highlights) assert.ok(article.includes(`<li>${escape(highlight)}</li>`))
          assert.ok(article.includes(escape(job.tech.join(' / '))))
        } else {
          assert.match(article, /work-record--current/)
          assert.ok(article.includes(`<p>${escape(job.role)}</p>`), 'current fact is body copy, not a role heading')
        }
      }
      const current = html.match(/<article [^>]*data-ff-section="job-current"[^>]*>.*?<\/article>/g) || []
      assert.equal(current.length, 1)
      assert.match(current[0], /tabindex="-1" aria-label="VinFast"/)
      assert.ok(current[0].includes(language === 'vi' ? 'Đang làm việc tại VinFast' : 'Currently working at VinFast'))
      assert.doesNotMatch(current[0], /<ul|portfolio-tech|portfolio-meta/)
      assert.doesNotMatch(html, /<dialog|<dl|<dt|<form|aria-haspopup|aria-pressed|Count|pf-work__(?:filters|grid|index|metrics|contact)|data-ff-section="(?:project[^"]*|impact|honors|contact)"/)
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
      const factOnly = data.experience.map(job => job.current
        ? { ...job, period: 'CURRENT_DATE_SENTINEL', tech: ['CURRENT_TECH_SENTINEL'], highlights: ['CURRENT_DETAIL_SENTINEL'] }
        : job)
      assert.equal(renderToStaticMarkup(createElement(WorkView, { ...props, data: { ...employmentOnly, experience: factOnly } })), html, 'current details never render even if supplied')
      const extraPast = { ...data.experience.find(job => !job.current), company: 'Historical record fixture', logo: undefined }
      const reordered = [extraPast, ...data.experience.toReversed()]
      const reorderedHtml = renderToStaticMarkup(createElement(WorkView, { ...props, data: { ...employmentOnly, experience: reordered } }))
      const articles = reorderedHtml.match(/<article\b[^>]*>.*?<\/article>/g) || []
      assert.equal(articles.length, reordered.length)
      reordered.forEach((job, index) => assert.ok(articles[index].includes(`<h2>${escape(job.company)}</h2>`), 'all records stay in supplied order'))
      const footer = tree.props.children.at(-1)
      assert.equal(footer.props.children[1].type, 'button')
      footer.props.children[1].props.onClick()
      assert.deepEqual(calls, ['contact'])
    }
  } finally { await server.close() }
})

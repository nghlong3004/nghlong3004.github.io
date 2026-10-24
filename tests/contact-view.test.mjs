import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { readFile } from 'node:fs/promises'

test('contact renders true bilingual links, shared draft, explicit unique labels and honest mail-app explanation', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { ContactView } = await server.ssrLoadModule('/src/features/portfolio/components/views/ContactView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const props = { data, contactDraft: { name: 'Visitor', email: 'visitor@example.com', location: 'Hà Nội', message: 'Backend & automation' }, onContactDraftChange() {}, contactValidation: { touched: {}, submitted: false }, onContactValidationChange() {} }
      const html = renderToStaticMarkup(createElement('div', null, createElement(ContactView, props), createElement(ContactView, props)))
      assert.ok(html.includes(data.ui.contactIntro))
      assert.ok(!html.includes(data.profile.portrait.src) && !html.includes(data.profile.portrait.alt))
      assert.equal((html.match(/class="[^"]*contact-view__hero[^"]*"/g) || []).length, 2)
      assert.ok(html.includes(`mailto:${data.profile.email}`))
      for (const link of data.links) assert.ok(html.includes(link.url))
      assert.ok(!/Vimeo|24h|success|fetch\(/i.test(html))
      assert.ok(html.includes(language === 'vi' ? 'ứng dụng email' : 'mail app'))
      for (const value of ['Visitor', 'visitor@example.com', 'Hà Nội', 'Backend &amp; automation']) assert.ok(html.includes(value))
      const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(match => match[1])
      assert.equal(ids.length, new Set(ids).size, 'hardware copies must not duplicate field or section IDs')
      const labels = [...html.matchAll(/for="([^"]+)"/g)].map(match => match[1])
      assert.equal(labels.length, 8)
      for (const id of labels) assert.ok(ids.includes(id))
      assert.equal((html.match(/required=""/g) || []).length, 6)
      assert.equal((html.match(/type="email"/g) || []).length, 2)
      assert.equal((html.match(/novalidate=""/gi) || []).length, 2)
      const socials = [...html.matchAll(/<div class="contact-view__socials">(.*?)<\/div>/g)]
      assert.equal(socials.length, 2)
      for (const [, row] of socials) {
        assert.equal((row.match(/<a /g) || []).length, 4)
        assert.ok(!row.includes('mailto:'))
        for (const label of ['GitHub', 'LinkedIn', 'Instagram', 'Facebook']) {
          assert.ok(row.includes(`aria-label="${label}" title="${label}"`))
          assert.ok(!row.includes(`>${label}<`), 'social anchors are icon-only')
        }
      }
      const emailRows = [...html.matchAll(/<div class="contact-view__email-row">(.*?)<\/div>/g)]
      assert.equal(emailRows.length, 2)
      for (const [, row] of emailRows) assert.ok(!/github|linkedin|instagram|facebook/i.test(row))
    }
  } finally { await server.close() }
})

test('inline errors follow shared touched/submitted state, correction and language without native popups', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { ContactView } = await server.ssrLoadModule('/src/features/portfolio/components/views/ContactView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const props = { data: portfolio[language], contactDraft: { name: ' ', email: 'bad', location: '', message: '\n ' }, onContactDraftChange() {}, contactValidation: { touched: {}, submitted: false }, onContactValidationChange() {} }
      const render = () => renderToStaticMarkup(createElement(ContactView, props))
      assert.ok(!render().includes('aria-invalid="true"'))
      props.contactValidation = { touched: { email: true }, submitted: false }
      let html = render()
      assert.equal((html.match(/aria-invalid="true"/g) || []).length, 1)
      assert.ok(html.includes(language === 'vi' ? 'Vui lòng nhập địa chỉ email hợp lệ.' : 'Please enter a valid email address.'))
      props.contactValidation = { touched: { email: true }, submitted: true }
      html = render()
      assert.equal((html.match(/aria-invalid="true"/g) || []).length, 3)
      const invalid = [...html.matchAll(/<(?:input|textarea)[^>]*aria-invalid="true"[^>]*aria-describedby="([^"]+)"/g)]
      assert.equal(invalid.length, 3)
      for (const [, id] of invalid) assert.ok(html.includes(`<p class="contact-view__error" id="${id}">`))
      assert.ok(!/name="location"[^>]*required/.test(html))
      props.contactDraft = { name: ' Visitor ', email: ' visitor@example.com ', location: '', message: ' Hello ' }
      html = render()
      assert.ok(!html.includes('aria-invalid="true"'))
      assert.ok(!html.includes('contact-view__error'))
      props.contactDraft.email = ''
      html = render()
      assert.equal((html.match(/aria-invalid="true"/g) || []).length, 1)
      assert.ok(html.includes(language === 'vi' ? 'Vui lòng nhập email.' : 'Please enter your email.'))
    }
  } finally { await server.close() }
})

test('focus is deferred, cancellable, detached/inert guarded and routed to the engine callback', async () => {
  const source = await readFile('src/features/portfolio/components/views/ContactView.tsx', 'utf8')
  assert.ok(!/reportValidity|setCustomValidity|fetch\(/.test(source))
  assert.match(source, /useLayoutEffect\(/)
  assert.match(source, /requestAnimationFrame\(/)
  assert.match(source, /return \(\) => cancelAnimationFrame\(frame\)/)
  assert.match(source, /!form\.isConnected/)
  assert.match(source, /form\.closest\('\[inert\], \[aria-hidden="true"\]'\)/)
  assert.match(source, /if \(onContactFocusField\) onContactFocusField\(element\)/)
  assert.match(source, /element\.focus\(\{ preventScroll: true \}\)/)
  assert.match(source, /onBlur: \(\) => touch\(field\)/)
  assert.match(source, /onContactValidationChange\(\{ \.\.\.contactValidation, submitted: true \}\)/)
  const css = await readFile('src/features/portfolio/styles/contact.css', 'utf8')
  assert.doesNotMatch(source, /from ['"]\.\.\/Portrait['"]|<Portrait\b|data-framer-background-image-wrapper/)
  assert.match(css, /\.contact-view__hero\.pf-page \{ display: block; min-height: 660px;/)
  assert.match(css, /\.contact-view__statement \{[^}]*min-height: 660px;/)
  assert.match(css, /\.portfolio-screen--compact \.contact-view__statement \{ min-height: 718px;/)
  assert.doesNotMatch(css, /contact-view__portrait|grid-template-columns/)
  assert.match(css, /\.contact-view__socials \{[^}]*flex-wrap: nowrap;[^}]*justify-content: center;/)
  assert.match(css, /\.contact-view__socials a \{[^}]*44px; min-height: 44px;/)
  assert.match(css, /\.portfolio-screen \.contact-view__social--github \{ color: #181717;/)
  assert.match(css, /\.portfolio-screen \.contact-view__social--facebook \{ color: #0866ff;/)
})

test('mailto encodes Unicode, delimiters and multiline user content without adding mail headers', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { contactDraftMailto } = await server.ssrLoadModule('/src/features/portfolio/components/views/ContactView.tsx')
    const draft = { name: ' Long\r\nBcc: other@example.com ', email: 'a+b@example.com', location: ' Hà Nội & HCM? ', message: ' Chào!\nBudget: 100% & scope=#?\nXin cảm ơn. ' }
    for (const vi of [false, true]) {
      const url = new URL(contactDraftMailto('real+brief@example.com', draft, vi))
      assert.equal(url.protocol, 'mailto:')
      assert.equal(decodeURIComponent(url.pathname), 'real+brief@example.com')
      assert.deepEqual([...url.searchParams.keys()], ['subject', 'body'])
      assert.equal(url.searchParams.get('subject'), `${vi ? 'Trao đổi dự án' : 'Project brief'} — Long Bcc: other@example.com`)
      assert.equal(url.searchParams.get('body'), [`${vi ? 'Họ tên' : 'Name'}: ${draft.name.trim()}`, `Email: ${draft.email}`, `${vi ? 'Địa điểm' : 'Location'}: Hà Nội & HCM?`, '', draft.message.trim()].join('\r\n'))
    }
    const empty = contactDraftMailto('test@example.com', { name: '', email: '', location: '', message: '' }, false)
    assert.ok(!empty.includes('undefined'))
  } finally { await server.close() }
})

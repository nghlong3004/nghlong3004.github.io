import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('contact renders true bilingual links, shared draft, explicit unique labels and honest mail-app explanation', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { ContactView } = await server.ssrLoadModule('/src/features/portfolio/components/views/ContactView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      const props = { data, contactDraft: { name: 'Visitor', email: 'visitor@example.com', location: 'Hà Nội', message: 'Backend & automation' }, onContactDraftChange() {} }
      const html = renderToStaticMarkup(createElement('div', null, createElement(ContactView, props), createElement(ContactView, props)))
      assert.ok(html.includes(data.ui.contactIntro))
      assert.ok(html.includes(data.profile.portrait.src) && html.includes(data.profile.portrait.alt))
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
    }
  } finally { await server.close() }
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

import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'
import { readFile } from 'node:fs/promises'

test('controlled device drawer exposes one localized dialog, real project content and no closed interception', async () => {
  const server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { ProjectOverlay } = await server.ssrLoadModule('/src/features/portfolio/components/kokonut/ProjectOverlay.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      for (const project of data.projects) {
        const html = renderToStaticMarkup(createElement(ProjectOverlay, { data, projectId: project.id, onClose() {} }))
        assert.equal((html.match(/role="dialog"/g) ?? []).length, 1)
        assert.ok(html.includes('aria-modal="true"'))
        assert.ok(html.includes(language === 'vi' ? 'Đóng dự án' : 'Close project'))
        assert.ok(html.includes(project.title) && html.includes(project.image.src))
        assert.ok(html.includes('aria-expanded="false"') && html.includes('inert=""'))
        for (const image of project.images) assert.ok(html.includes(image))
        for (const url of [project.liveUrl, project.sourceCode].filter(Boolean)) assert.ok(html.includes(url.replaceAll('&', '&amp;')))
        for (const label of [data.ui.role, data.ui.more]) assert.ok(html.includes(label))
      }
      for (const projectId of [null, 'missing-project']) {
        assert.equal(renderToStaticMarkup(createElement(ProjectOverlay, { data, projectId, onClose() {} })), '')
      }
    }
  } finally { await server.close() }
})

test('drawer stays device-local, preserves upstream easing and cleans its modal resources', async () => {
  const source = await readFile(new URL('../src/features/portfolio/components/kokonut/ProjectOverlay.tsx', import.meta.url), 'utf8')
  const css = await readFile(new URL('../src/features/portfolio/styles/project-overlay.css', import.meta.url), 'utf8')
  assert.ok(!source.includes('createPortal') && !source.includes('useReducedMotion'))
  assert.ok(source.includes('[0.23, 1, 0.32, 1]'))
  assert.ok(css.includes('cubic-bezier(.32,.72,0,1)'))
  assert.ok(css.includes('position: absolute') && css.includes('inset: 0'))
  assert.ok(source.includes("'[data-ff-screen-overlay]'"))
  assert.ok(source.includes('cancelAnimationFrame(frame)') && source.includes('observer.disconnect()'))
  for (const name of ['keydown', 'focusin', 'wheel', 'touchstart', 'touchmove']) {
    assert.ok(source.includes(`removeEventListener('${name}'`))
  }
  assert.ok(source.includes('node.inert = inert') && source.includes('document.body.style.overflow = bodyOverflow'))
})

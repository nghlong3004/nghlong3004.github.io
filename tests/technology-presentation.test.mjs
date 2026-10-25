import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createServer } from 'vite'

test('Home and About use accepted bilingual headings and only loop inputs lose the three labels', async () => {
  const server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: 'custom',
  })
  try {
    const { HomeView } = await server.ssrLoadModule('/src/features/portfolio/components/views/HomeView.tsx')
    const { AboutView } = await server.ssrLoadModule('/src/features/portfolio/components/views/AboutView.tsx')
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    const removed = ['OAuth2/JWT', 'WebSocket', 'A* Pathfinding']

    for (const language of ['vi', 'en']) {
      const data = portfolio[language]
      for (const [view, expectedHeading] of [[HomeView,
        language === 'vi' ? 'Công nghệ sử dụng' : 'Project technologies'],
      [AboutView,
        language === 'vi' ? 'Công nghệ sử dụng' : 'Tools I work with']]) {
        const html = renderToStaticMarkup(createElement(view, {
          data,
          onNavigate() {},
          onToggle() {},
          expandedProject: null,
        }))
        assert.ok(html.includes(`>${expectedHeading}</h2>`) || html.includes(`>${expectedHeading}</h3>`), `${language} heading: ${expectedHeading}`)
        const loopNames = [...html.matchAll(/technology-loop__name">([^<]+)</g)].map((match) => match[1])
        for (const name of removed) assert.ok(!loopNames.includes(name), `${language} loop includes ${name}`)
      }
      for (const project of data.projects) {
        for (const label of removed) assert.ok(!project.techStack.includes(label), `${language} ${project.id} ${label}`)
      }
    }

    for (const language of ['vi', 'en']) {
      const olympic = portfolio[language].projects.find(({ id }) => id === 'olympic-humg')
      assert.ok(olympic.role.some(({ items = [] }) => items.some((item) => item.includes('OAuth2') && item.includes('JWT'))))
    }
  } finally {
    await server.close()
  }
})

test('technology headings retain the single-line treatment', () => {
  const home = readFileSync(new URL('../src/features/portfolio/styles/home.css', import.meta.url), 'utf8')
  const about = readFileSync(new URL('../src/features/portfolio/styles/about.css', import.meta.url), 'utf8')
  assert.match(home, /\.home-tools__heading\s*\{[^}]*\bwhite-space\s*:\s*nowrap\s*(?:;|\})/)
  assert.match(about, /\.about-view__tools-heading\s*\{[^}]*\bwhite-space\s*:\s*nowrap\s*(?:;|\})/)
})

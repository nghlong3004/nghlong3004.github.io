import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
import { parseSync, traverse } from '@babel/core'

const views = ['Home', 'Work', 'Projects', 'About', 'Contact']
const sources = Object.fromEntries(views.map(view => [view, readFileSync(new URL(`../src/features/portfolio/components/views/${view}View.tsx`, import.meta.url), 'utf8')]))
const trees = Object.fromEntries(views.map(view => [view, parseSync(sources[view], { configFile: false, babelrc: false, parserOpts: { plugins: ['typescript', 'jsx'] } })]))
const attribute = (node, name) => node.openingElement.attributes.find(attr => attr.type === 'JSXAttribute' && attr.name.name === name)
const tag = node => node.openingElement.name.name
const children = node => node.children.filter(child => child.type === 'JSXElement')

test('all five views expose deterministic image and heading markers to the existing scanner', () => {
  const expected = { Home: [2, 8], Work: [0, 2], Projects: [1, 2], About: [1, 6], Contact: [0, 2] }
  for (const view of views) {
    let images = 0, headings = 0
    traverse(trees[view], { JSXElement(path) {
      const node = path.node
      if (attribute(node, 'data-framer-background-image-wrapper')) images++
      if (attribute(node, 'data-framer-component-type')?.value.value === 'RichTextContainer') {
        assert.match(tag(children(node)[0]), /^h[1-3]$/, `${view}: isolated heading target`)
        headings++
      }
    } })
    assert.deepEqual([images, headings], expected[view], view)
    // Hardware copies must see the same source order, independent of OS motion preferences.
    assert.doesNotMatch(sources[view], /prefers-reduced-motion|matchMedia|copyIndex|Math\.random|useEffect/)
  }
})

test('image markers contain real images and animate only local media or project cards', () => {
  for (const view of views) traverse(trees[view], { JSXElement(path) {
    const node = path.node
    if (!attribute(node, 'data-framer-background-image-wrapper')) return
    assert.ok(children(node).some(child => ['img', 'Portrait'].includes(tag(child))), view)
    const parent = path.parentPath.node
    assert.equal(parent.type, 'JSXElement', view)
    assert.ok(['div', 'button'].includes(tag(parent)), `${view}: never reveal a hero, section or page`)
    const className = attribute(parent, 'className')?.value?.value || ''
    assert.doesNotMatch(className, /pf-page|hero|gallery|grid|statement|copy/)
    assert.ok(children(parent).every(child => child === node || tag(child) === 'span' || attribute(child, 'className')?.value?.value === 'pf-work__caption'), `${view}: local image/card children only`)
  } })
})

test('only actual Home and About metric values opt into count-up', () => {
  for (const view of views) {
    let count = 0
    traverse(trees[view], { JSXElement(path) {
      const node = path.node
      const name = attribute(node, 'data-framer-name')?.value?.value
      if (!name?.startsWith('Count')) return
      assert.equal(tag(node), 'dt', view)
      assert.equal(attribute(node, 'data-framer-component-type'), undefined, 'do not preclassify counters as text')
      assert.match(sources[view], /data\.impact\.map\(/)
      count++
    } })
    assert.equal(count, ['Home', 'About'].includes(view) ? 1 : 0, view)
  }
})

test('Home fits the desktop name and preserves the compact word break at unchanged size', () => {
  const css = readFileSync(new URL('../src/features/portfolio/styles/home.css', import.meta.url), 'utf8')
  const shared = readFileSync(new URL('../src/features/portfolio/styles/portfolio.css', import.meta.url), 'utf8')
  assert.match(css, /\.portfolio-screen:not\(\.portfolio-screen--compact\) \.home-hero__summary \.pf-name\s*\{\s*font-size: 100px;\s*white-space: nowrap;/)
  assert.match(css, /\.portfolio-screen--compact \.home-hero__summary \.pf-name\s*\{ max-width: min-content; overflow-wrap: normal; \}/)
  assert.match(shared, /--pf-name: 900 78px\/\.84 var\(--pf-display\)/)
  assert.match(sources.Home, /aria-label=\{data\.profile\.name\}>\{data\.profile\.displayName\}/)
})

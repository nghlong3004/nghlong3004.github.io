import assert from 'node:assert/strict'
import test from 'node:test'

const node = (tag, ...children) => ({ tagName: tag.toUpperCase(), children })

test('semantic groups cover ordinary content once while later sections remain separate', async () => {
  const composition = await import('../src/features/foldfolio/engine/compositionMotion.ts').catch(() => ({}))
  assert.equal(typeof composition.collectCompositionGroups, 'function')
  const title = node('h1'), intro = node('p'), action = node('button'), image = node('img')
  const hero = node('header', node('div', title, intro, action), node('figure', image))
  const storyCopy = node('p'), story = node('section', node('h2'), storyCopy)
  const honorsCopy = node('p'), honors = node('section', node('h2'), honorsCopy)
  const footer = node('footer', node('button'))
  const screen = node('div', node('article', hero, node('div', story, honors), footer))
  const groups = composition.collectCompositionGroups(screen)
  assert.deepEqual(groups, [hero, story, honors, footer])
  for (const leaf of [title, intro, action, image, storyCopy, honorsCopy]) {
    const contains = (parent, target) => parent === target || parent.children.some(child => contains(child, target))
    assert.equal(groups.filter(group => contains(group, leaf)).length, 1)
  }
})

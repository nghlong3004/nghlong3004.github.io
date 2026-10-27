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

test('center-out insets open equally to both landscape edges using resolved port', async () => {
  const { centerOutInsets } = await import('../src/features/foldfolio/engine/compositionMotion.ts')
  assert.equal(centerOutInsets(false, 976, 1600, 660, 300, 0), 'inset(0px 488px 0px 488px)')
  assert.equal(centerOutInsets(false, 976, 1600, 660, 300, 0.5), 'inset(0px 244px 0px 244px)')
})

test('portrait aperture is symmetric around the visible viewport, not tall root midpoint', async () => {
  const { centerOutInsets } = await import('../src/features/foldfolio/engine/compositionMotion.ts')
  assert.equal(centerOutInsets(true, 358, 1600, 718, 300, 0), 'inset(659px 0px 941px 0px)')
  assert.equal(centerOutInsets(true, 358, 1600, 718, 300, 0.5), 'inset(479.5px 0px 761.5px 0px)')
  assert.equal(centerOutInsets(true, 358, 1600, 718, 300, 1), 'inset(300px 0px 582px 0px)')
})

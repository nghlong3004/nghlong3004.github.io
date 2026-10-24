import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { brandIcons } from '../src/features/portfolio/lib/brandIcons.ts'
import { getTechnologyIcon } from '../src/features/portfolio/lib/technologyIcons.ts'

test('the shared social mapping uses all four scoped brand exports', () => {
  assert.deepEqual(Object.keys(brandIcons).sort(), ['facebook', 'github', 'instagram', 'linkedin'])
  for (const icon of Object.values(brandIcons)) assert.equal(typeof icon, 'function')
})

test('technology lookup normalizes known labels and honest product aliases', () => {
  for (const label of [' Java ', 'java swing', 'Spring Boot', 'Docker Compose', 'Redis Streams']) {
    assert.equal(typeof getTechnologyIcon(label)?.icon, 'function', label)
  }
  assert.equal(getTechnologyIcon('Langfuse'), undefined)
  assert.equal(getTechnologyIcon('Spring AI'), undefined)
  assert.equal(getTechnologyIcon('OAuth2/JWT'), undefined)
  assert.equal(getTechnologyIcon('WebSocket'), undefined)
  assert.equal(getTechnologyIcon('CI/CD'), undefined)
  assert.equal(getTechnologyIcon('A* Pathfinding'), undefined)
  assert.equal(getTechnologyIcon(''), undefined)
  assert.equal(getTechnologyIcon('toString'), undefined)
  assert.equal(getTechnologyIcon('__proto__'), undefined)
})

test('genuine local technology assets retain pinned upstream bytes and notices', () => {
  const attributes = readFileSync(new URL('../.gitattributes', import.meta.url), 'utf8')
  assert.match(attributes, /^public\/technology\/promptfoo\.svg -text$/m)
  assert.match(attributes, /^public\/technology\/LICENSE\.playwright\.txt -text$/m)
  const assets = [
    [' Playwright ', 'playwright', '6b0a4367bdeab10995bc239278f04c68c10e48adbec15e799e01909a0d66dcb9'],
    ['pRoMpTfOo', 'promptfoo', 'e8e3ad52c4ea4431c169a97ad158f5211915f831e273fa83571d40c212431b32'],
  ]
  for (const [label, name, sha256] of assets) {
    const technology = getTechnologyIcon(label)
    assert.equal(technology.src, `/technology/${name}.svg`)
    assert.equal(technology.icon, undefined)
    const bytes = readFileSync(new URL(`../public${technology.src}`, import.meta.url))
    assert.equal(createHash('sha256').update(bytes).digest('hex'), sha256)
    assert.match(bytes.toString(), /<svg\b/)
    assert.doesNotMatch(bytes.toString(), /<script\b|<foreignObject\b|(?:href|src)=["']https?:/i)
    assert.ok(readFileSync(new URL(`../public/technology/LICENSE.${name}.txt`, import.meta.url)).length > 1000)
  }
  assert.match(readFileSync(new URL('../public/technology/NOTICE.playwright.txt', import.meta.url), 'utf8'), /Copyright \(c\) Microsoft Corporation/)
})

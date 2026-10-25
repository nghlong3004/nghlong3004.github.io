import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const read = (path, encoding = 'utf8') => readFileSync(new URL(`../${path}`, import.meta.url), encoding)
const font = read('public/fonts/alumni-sans-variable.ttf', null)
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
const stylesPath = 'src/features/portfolio/styles/'
const css = read(`${stylesPath}portfolio.css`)
const drawer = read(`${stylesPath}project-overlay.css`)

function table(tag) {
  for (let i = 0; i < font.readUInt16BE(4); i++) {
    const record = 12 + i * 16
    if (font.toString('ascii', record, record + 4) === tag) {
      const offset = font.readUInt32BE(record + 8)
      return font.subarray(offset, offset + font.readUInt32BE(record + 12))
    }
  }
  assert.fail(`Missing SFNT table: ${tag}`)
}

test('unmodified primary Alumni binary has the real family, OFL and variable 800/900', () => {
  // Google Fonts e7db6ca603fd4862010383ff17ffd6cc4ffac1c0/ofl/alumnisans.
  assert.equal(sha256(font), '9255d5201c7aba5bf1bde1e8521f0fee691f0588b83f40db228a5f9bbaacfbc4')
  const names = table('name')
  const families = []
  for (let i = 0; i < names.readUInt16BE(2); i++) {
    const r = 6 + i * 12
    if (names.readUInt16BE(r) !== 3 || ![1, 16].includes(names.readUInt16BE(r + 6))) continue
    const start = names.readUInt16BE(4) + names.readUInt16BE(r + 10)
    families.push(Buffer.from(names.subarray(start, start + names.readUInt16BE(r + 8))).swap16().toString('utf16le'))
  }
  assert.ok(families.includes('Alumni Sans'))
  const axis = table('fvar')
  assert.equal(axis.readUInt16BE(8), 1)
  const start = axis.readUInt16BE(4)
  assert.equal(axis.toString('ascii', start, start + 4), 'wght')
  assert.deepEqual([4, 8, 12].map((n) => axis.readInt32BE(start + n) / 65536), [100, 100, 900])
  const instances = start + axis.readUInt16BE(8) * axis.readUInt16BE(10)
  const weights = Array.from({ length: axis.readUInt16BE(12) }, (_, i) => axis.readInt32BE(instances + i * axis.readUInt16BE(14) + 4) / 65536)
  for (const weight of [800, 900]) assert.ok(weights.includes(weight), `Real variable instance ${weight}`)
  const license = read('public/fonts/AlumniSans-OFL.txt')
  // Full upstream OFL text; line endings and one trailing space normalized.
  assert.equal(sha256(license), 'b5426e09a438946a10d36d527c002a279d57acc22a32480d83fb4c95ebe8d956')
  assert.match(license, /^Copyright 2015 The Alumni Sans Project Authors/)
  assert.match(license, /SIL OPEN FONT LICENSE Version 1\.1/)
  assert.match(license, /OTHER DEALINGS IN THE FONT SOFTWARE\.\s*$/)
})

test('Alumni Unicode cmap maps all 146 Vietnamese letters and eight NFD marks to glyphs', () => {
  const cmap = table('cmap')
  let mapping
  for (let i = 0; i < cmap.readUInt16BE(2); i++) {
    const r = 4 + i * 8
    const offset = cmap.readUInt32BE(r + 4)
    if (cmap.readUInt16BE(r) === 3 && cmap.readUInt16BE(r + 2) === 1 && cmap.readUInt16BE(offset) === 4) mapping = cmap.subarray(offset)
  }
  assert.ok(mapping, 'Unicode BMP format-4 cmap')
  const count = mapping.readUInt16BE(6) / 2
  const ends = 14, starts = ends + 2 * count + 2, deltas = starts + 2 * count, ranges = deltas + 2 * count
  function glyph(character) {
    const code = character.codePointAt(0)
    for (let i = 0; i < count; i++) {
      if (code > mapping.readUInt16BE(ends + 2 * i) || code < mapping.readUInt16BE(starts + 2 * i)) continue
      const delta = mapping.readInt16BE(deltas + 2 * i)
      const range = mapping.readUInt16BE(ranges + 2 * i)
      if (!range) return (code + delta) & 0xffff
      const id = mapping.readUInt16BE(ranges + 2 * i + range + 2 * (code - mapping.readUInt16BE(starts + 2 * i)))
      return id ? (id + delta) & 0xffff : 0
    }
    return 0
  }
  const letters = new Set('Đđ')
  for (const base of 'aăâeêioôơuưyAĂÂEÊIOÔƠUƯY') {
    for (const tone of ['', '\u0300', '\u0301', '\u0303', '\u0309', '\u0323']) letters.add((base + tone).normalize('NFC'))
  }
  assert.equal(letters.size, 146)
  const marks = [...'\u0300\u0301\u0303\u0309\u0323\u0302\u0306\u031b']
  assert.equal(marks.length, 8)
  const ascii = Array.from({ length: 95 }, (_, i) => String.fromCodePoint(32 + i))
  for (const character of [...letters, ...marks, ...ascii]) assert.ok(glyph(character) > 0, `Missing ${character} U+${character.codePointAt(0).toString(16)}`)
})

test('every display declaration selects Alumni for both languages without changing role weights', () => {
  const face = [...css.matchAll(/@font-face\s*\{([^}]+)\}/g)].map((m) => m[1])
  assert.equal(face.length, 4)
  assert.equal(face.filter((body) => body.includes("font-family: 'Alumni Sans'")).length, 1)
  assert.ok(face.some((body) => /font-family: 'Alumni Sans'; src: url\('\/fonts\/alumni-sans-variable.ttf'\) format\('truetype'\); font-weight: 100 900; font-display: swap;/.test(body)))
  assert.doesNotMatch(css + drawer, /Sofia|size-adjust|unicode-range|:lang\(|\[lang[=|]/)
  const root = css.match(/\.portfolio-screen, \.portfolio-cover, \.portfolio-call\s*\{([^}]+)\}/)[1]
  assert.match(root, /--pf-display: 'Alumni Sans', sans-serif;/)
  assert.match(root, /--pf-body: 'Geist', sans-serif; --pf-mono: 'Geist Mono', monospace;/)
  const direct = new Map([
    ['.portfolio-brand', '900 25px/.9'], ['.portfolio-scene-name', '900 300px/.8'],
    ['.portfolio-screen h1', '900 100px/.84'], ['.portfolio-screen h2', '900 72px/1.02'],
    ['.portfolio-impact dt', '900 62px/1'], ['.portfolio-email', '900 52px/1.2'],
    ['.portfolio-signature', '900 84px/1'], ['.portfolio-cover__clock', '800 132px/.9'],
    ['.portfolio-call__name', '900 48px/1'], ['.project-overlay__header h2', '900 48px/.94'],
    ['.project-overlay__details h3', '900 30px/.94'],
  ])
  const rules = [...(css + drawer).matchAll(/([^{}]+)\{([^{}]+)\}/g)]
  for (const [selector, metrics] of direct) {
    assert.ok(rules.some(([, s, body]) => s.trim() === selector && body.includes(`font: ${metrics} 'Alumni Sans', sans-serif;`)), selector)
  }
  assert.equal(rules.filter(([, , body]) => /\bfont: [^;]*'Alumni Sans'/.test(body)).length, direct.size)
  const tokens = new Map([...root.matchAll(/(--pf-[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]]))
  function resolve(value) {
    return value.replace(/var\((--pf-[\w-]+)\)/g, (_, key) => {
      assert.ok(tokens.has(key), key)
      return resolve(tokens.get(key))
    })
  }
  for (const key of ['title', 'name', 'heading', 'card-title']) assert.match(resolve(tokens.get(`--pf-${key}`)), /^900 .*'Alumni Sans', sans-serif$/)
  let uses = 0
  for (const file of readdirSync(new URL(`../${stylesPath}`, import.meta.url)).filter((f) => f.endsWith('.css'))) {
    const source = read(stylesPath + file)
    assert.doesNotMatch(source, /Sofia|:lang\(|\[lang[=|]/, file)
    for (const [, declaration] of source.matchAll(/(?:font|--pf-(?:title|name|heading|card-title)):\s*([^;{}]+);/g)) {
      if (!/var\(--pf-(?:display|title|name|heading|card-title)\)/.test(declaration)) continue
      assert.match(resolve(declaration), /^900 .*'Alumni Sans', sans-serif$/, `${file}: ${declaration}`)
      uses++
    }
  }
  assert.equal(uses, 16, 'Shared tokens reach view headings, footers, names, cards and metrics, including compact overrides')
  assert.match(read(`${stylesPath}home.css`), /\.portfolio-screen--compact \.home-hero__summary \.pf-name \{ max-width: min-content; overflow-wrap: normal; \}/, 'Keep the compact name split at its space, not inside a word')
  assert.ok(face.some((body) => body.includes("font-family: 'Geist';") && body.includes('font-weight: 500 600;')))
})

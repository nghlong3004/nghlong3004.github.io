import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import test from 'node:test'

const read = (path, encoding = 'utf8') => readFileSync(new URL(`../${path}`, import.meta.url), encoding)
const font = read('public/fonts/alumni-sans-variable.ttf', null)
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex')
const stylesPath = 'src/features/portfolio/styles/'

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

test('active typography keeps Alumni display and Geist body, controls and metadata in both languages', () => {
  const files = readdirSync(new URL(`../${stylesPath}`, import.meta.url)).filter((file) => file.endsWith('.css'))
  const styles = [['globals.css', read('src/app/styles/globals.css')], ...files.map((file) => [file, read(stylesPath + file)])]
  const declaration = (body, name) => body.match(new RegExp(`(?:^|;)\\s*${name}\\s*:\\s*([^;]+)`))?.[1]?.trim()
  const rules = styles.flatMap(([file, source]) => {
    assert.doesNotMatch(source, /Geist Mono|--pf-mono|geist-mono|Sofia|size-adjust|unicode-range|:lang\(|\[lang[=|]/, file)
    return [...source.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{([^{}]+)\}/g)]
      .map(([, selector, body]) => ({ file, selector: selector.trim(), body }))
  })
  const face = rules.filter(({ selector }) => selector === '@font-face').map(({ body }) => ({
    family: declaration(body, 'font-family'),
    src: declaration(body, 'src'),
    weight: declaration(body, 'font-weight'),
    display: declaration(body, 'font-display'),
  }))
  assert.deepEqual(face.sort((a, b) => a.src.localeCompare(b.src)), [
    { family: "'Alumni Sans'", src: "url('/fonts/alumni-sans-variable.ttf') format('truetype')", weight: '100 900', display: 'swap' },
    { family: "'Geist'", src: "url('/fonts/geist-medium.ttf') format('truetype')", weight: '500 600', display: 'swap' },
    { family: "'Geist'", src: "url('/fonts/geist-regular.ttf') format('truetype')", weight: '400', display: 'swap' },
  ])

  const root = rules.find(({ selector }) => selector === '.portfolio-screen, .portfolio-cover, .portfolio-call')?.body
  assert.ok(root, 'shared portfolio font roles')
  const compact = rules.find(({ selector, body }) => selector === '.portfolio-screen--compact' && declaration(body, '--pf-title'))?.body
  assert.ok(compact, 'compact font roles')
  const tokens = new Map([...root.matchAll(/(--pf-[\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [key, value]))
  const compactTokens = new Map([...tokens, ...[...compact.matchAll(/(--pf-[\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [key, value])])
  assert.equal(tokens.get('--pf-display'), "'Alumni Sans', sans-serif")
  assert.equal(tokens.get('--pf-body'), "'Geist', sans-serif")
  function resolve(value, roles = tokens) {
    assert.ok(value, 'font declaration exists')
    return value.replace(/var\((--pf-[\w-]+)\)/g, (_, key) => resolve(roles.get(key), roles))
  }
  for (const [key, desktop, compactSize] of [
    ['title', 84, 60], ['name', 100, 72], ['heading', 60, 44], ['card-title', 30, 28],
  ]) {
    assert.equal(resolve(tokens.get(`--pf-${key}`)), `900 ${desktop}px/1 'Alumni Sans', sans-serif`, `desktop ${key} size`)
    assert.equal(resolve(compactTokens.get(`--pf-${key}`), compactTokens), `900 ${compactSize}px/1 'Alumni Sans', sans-serif`, `compact ${key} size`)
  }
  for (const roles of [tokens, compactTokens]) {
    for (const key of ['title', 'name', 'heading', 'card-title']) {
      assert.match(resolve(roles.get(`--pf-${key}`), roles), /^900\b.*'Alumni Sans', sans-serif$/, key)
    }
  }

  function fontAt(selector) {
    const body = rules.find((rule) => rule.selector === selector)?.body
    assert.ok(body, selector)
    return resolve(declaration(body, 'font'))
  }
  assert.equal(fontAt('.portfolio-screen .pf-page'), "400 16px/1.6 'Geist', sans-serif")
  assert.equal(fontAt('.portfolio-screen .pf-meta'), "500 13px/1.45 'Geist', sans-serif")
  assert.equal(fontAt('.portfolio-screen .pf-action'), "500 13px/1.45 'Geist', sans-serif")
  for (const selector of [
    '.portfolio-screen h1', '.portfolio-screen h2', '.portfolio-impact dt',
    '.portfolio-email', '.portfolio-signature', '.portfolio-call__name',
    '.project-overlay__header h2', '.project-overlay__details h3',
    '.portfolio-screen .pf-header h1', '.portfolio-screen .pf-name',
    '.portfolio-screen .pf-section h2', '.portfolio-screen .pf-card-title',
    '.portfolio-screen .pf-metrics dt', '.portfolio-screen .home-footer h2',
  ]) assert.match(fontAt(selector), /^900\b.*'Alumni Sans', sans-serif$/, selector)
  assert.match(fontAt('.portfolio-cover__clock'), /^800\b.*'Alumni Sans', sans-serif$/)
  for (const [selector, weight] of [
    ['.portfolio-screen .pf-page', 400], ['.portfolio-screen .pf-meta', 500],
    ['.portfolio-screen .pf-action', 500], ['.portfolio-nav', 500],
    ['.contact-view__brief label', 500], ['.technology-loop__fallback', 600],
  ]) assert.match(fontAt(selector), new RegExp(`^${weight}\\b.*'Geist', sans-serif$`), selector)

  for (const { file, selector, body } of rules) {
    if (selector === '@font-face') continue
    for (const name of ['font', 'font-family']) {
      const value = declaration(body, name)
      if (!value || value === 'inherit') continue
      const resolved = resolve(value)
      assert.match(resolved, /(?:'Alumni Sans'|'Geist'|\bGeist), sans-serif$/, `${file}: ${selector}`)
      if (name === 'font') {
        const weight = resolved.includes('Alumni Sans') ? (selector === '.portfolio-cover__clock' ? 800 : 900) : '(?:400|500|600)'
        assert.match(resolved, new RegExp(`^${weight}\\b`), `${file}: ${selector}`)
      }
    }
  }
})

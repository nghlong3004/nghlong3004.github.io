import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import test from 'node:test'
import { getSectionScrollY } from '../src/features/foldfolio/engine/navigation.ts'
import { projects } from '../src/features/portfolio/data/projects.ts'
import { profiles } from '../src/features/portfolio/data/profiles.ts'
import { experiences } from '../src/features/portfolio/data/experiences.ts'
import { honors } from '../src/features/portfolio/data/honors.ts'
import { impacts } from '../src/features/portfolio/data/impacts.ts'
import { stories } from '../src/features/portfolio/data/stories.ts'
import { labels } from '../src/features/portfolio/data/labels.ts'
import { links } from '../src/features/portfolio/data/links.ts'
import { portraits } from '../src/features/portfolio/data/portrait.ts'

const geometry = { mode: 'fold', U1: 1000, s: 0.8, innerMax: 2000 }
test('navigation opens the device and scales a section offset below the status bar', () => {
  assert.equal(getSectionScrollY(100, 548, geometry), 1500)
  assert.equal(getSectionScrollY(100, 548, { ...geometry, mode: 'open' }), 500)
})
test('navigation clamps the beginning and end without entering the closing phase', () => {
  assert.equal(getSectionScrollY(100, 0, geometry), 1100)
  assert.equal(getSectionScrollY(100, 5000, geometry), 2700)
  assert.equal(getSectionScrollY(100, 500, { ...geometry, innerMax: 0 }), 1100)
})
test('both languages preserve the full dataset and stable project identifiers', () => {
  assert.deepEqual(projects.vi.map(p => p.id), projects.en.map(p => p.id))
  assert.deepEqual(Object.keys(labels.vi), Object.keys(labels.en))
  for (const language of ['vi', 'en']) {
    assert.equal(projects[language].length, 4)
    assert.equal(experiences[language].length, 2)
    assert.equal(honors[language].length, 3)
    assert.equal(impacts[language].length, 4)
    assert.equal(stories[language].principles.length, 4)
    assert.equal(profiles[language].email, 'nghlong3004@gmail.com')
    assert.equal(profiles[language].displayName, 'HOANG LONG')
    assert.equal(projects[language].find(project => project.id === 'vinqa').image.src, '/project/vinqa/header.webp')
    for (const project of projects[language]) {
      assert.ok(project.details.length && project.role.length)
      assert.ok(project.sourceCode)
      assert.ok(!/<\/?(?:ul|li|br|strong)\b/.test(JSON.stringify(project)))
    }
  }
  assert.ok(projects.vi.find(p => p.id === 'vinqa').liveUrl)
  assert.equal(projects.vi.find(p => p.id === 'vsf-qc-copilot').liveUrl, undefined)
  assert.ok(links.some(link => link.url === 'mailto:nghlong3004@gmail.com'))
})
test('all project screenshots and company logos resolve locally', () => {
  const assets = [
    '/favicon.webp', profiles.vi.portrait.src,
    '/fonts/geist-regular.ttf', '/fonts/sofia-extra-condensed-black.ttf', '/fonts/sofia-extra-condensed-extrabold.ttf',
    ...projects.vi.flatMap(project => [project.image.src, ...project.images]),
    ...experiences.vi.flatMap(job => [job.logo, job.logoDark].filter(Boolean)),
  ]
  for (const asset of assets) assert.ok(existsSync(new URL(`../public${asset}`, import.meta.url)), asset)
})

test('all localized portraits share the supplied original photo with neutral alt text', () => {
  for (const lang of ['vi', 'en']) {
    assert.equal(portraits[lang].src, '/portrait/entry-wallpaper.jpg')
    assert.equal(profiles[lang].portrait, portraits[lang])
    assert.equal('referenceCrop' in portraits[lang], false)
    assert.ok(!portraits[lang].alt.includes(profiles[lang].name))
  }
  assert.equal(portraits.vi.alt, 'Ảnh chân dung do người dùng cung cấp')
  assert.equal(portraits.en.alt, 'User-supplied portrait photograph')
  const bytes = readFileSync(new URL(`../public${portraits.vi.src}`, import.meta.url))
  assert.equal(createHash('sha256').update(bytes).digest('hex'), '0f51f12fbfdd28f6f0d091a0eb2fdf5f9b3440bdb6bf0246157c266fddb34df2')
})

test('social destinations preserve the shared username and recognizable icon identity', () => {
  assert.deepEqual(links.map(({ label, url, icon }) => [label, url, icon]), [
    ['Email', 'mailto:nghlong3004@gmail.com', 'mail'],
    ['GitHub', 'https://github.com/nghlong3004', 'github'],
    ['LinkedIn', 'https://www.linkedin.com/in/nghlong3004', 'linkedin'],
    ['Instagram', 'https://www.instagram.com/nghlong3004', 'instagram'],
    ['Facebook', 'https://fb.com/nghlong3004', 'facebook'],
  ])
  assert.equal(experiences.vi.find(job => job.current).role, 'Đang làm việc tại VinFast')
  assert.equal(experiences.en.find(job => job.current).role, 'Currently working at VinFast')
})

import { formatVietnamTime, getCompletedAgeInVietnam } from '../src/features/portfolio/lib/vietnamTime.ts'
import { resolvePortfolioLanguage } from '../src/features/portfolio/lib/language.ts'
import { applyGlowDefault } from '../src/app/config/scenePreference.ts'

test('the live clock always uses Vietnam time, including midnight across a UTC date boundary', () => {
  assert.equal(formatVietnamTime(new Date('2026-10-23T16:45:00Z')), '23:45')
  assert.equal(formatVietnamTime(new Date('2026-10-23T17:05:00Z')), '00:05')
})

test('age uses the Vietnam civil birthday and stays unchanged across New Year', () => {
  assert.equal(getCompletedAgeInVietnam(new Date('2026-06-05T16:59:59Z')), 20)
  assert.equal(getCompletedAgeInVietnam(new Date('2026-06-05T17:00:00Z')), 21)
  assert.equal(getCompletedAgeInVietnam(new Date('2026-12-31T16:59:59Z')), 21)
  assert.equal(getCompletedAgeInVietnam(new Date('2026-12-31T17:00:00Z')), 21)
  assert.equal(getCompletedAgeInVietnam(new Date('2027-06-05T17:00:00Z')), 22)
})

test('explicit language wins; supported browser preferences are ordered; unknown falls back to VI', () => {
  assert.equal(resolvePortfolioLanguage('vi', ['en-US']), 'vi')
  assert.equal(resolvePortfolioLanguage('en', ['vi-VN']), 'en')
  assert.equal(resolvePortfolioLanguage(null, ['en-GB', 'vi']), 'en')
  assert.equal(resolvePortfolioLanguage(null, ['vi-VN', 'en']), 'vi')
  assert.equal(resolvePortfolioLanguage(null, ['ja-JP', 'EN-us']), 'en')
  assert.equal(resolvePortfolioLanguage('invalid', ['en']), 'en')
  assert.equal(resolvePortfolioLanguage(null, ['ja-JP']), 'vi')
  assert.equal(resolvePortfolioLanguage(null, []), 'vi')
})

test('Glow migrates a stale scene once without discarding finish or later explicit choices', () => {
  const saved = new Map([['foldfolio:style', JSON.stringify({ scene: 'orbit', finish: 'coral' })]])
  const storage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) }
  applyGlowDefault(storage)
  assert.deepEqual(JSON.parse(saved.get('foldfolio:style')), { scene: 'glow', finish: 'coral' })
  saved.set('foldfolio:style', JSON.stringify({ scene: 'split', finish: 'sage' }))
  applyGlowDefault(storage)
  assert.deepEqual(JSON.parse(saved.get('foldfolio:style')), { scene: 'split', finish: 'sage' })
  saved.clear(); saved.set('foldfolio:style', 'null'); applyGlowDefault(storage)
  assert.deepEqual(JSON.parse(saved.get('foldfolio:style')), { scene: 'glow' })
  assert.doesNotThrow(() => applyGlowDefault({ getItem() { throw Error('blocked') }, setItem() { throw Error('blocked') } }))
  assert.equal(labels.vi.open, 'Cuộn để mở')
  assert.equal(labels.en.open, 'Scroll to unfold')
})

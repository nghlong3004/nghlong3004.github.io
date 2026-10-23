import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
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
    '/fonts/geist-regular.ttf', '/fonts/sofia-extra-condensed-black.ttf',
    ...projects.vi.flatMap(project => [project.image.src, ...project.images]),
    ...experiences.vi.flatMap(job => [job.logo, job.logoDark].filter(Boolean)),
  ]
  for (const asset of assets) assert.ok(existsSync(new URL(`../public${asset}`, import.meta.url)), asset)
})

import { formatVietnamTime } from '../src/features/portfolio/lib/vietnamTime.ts'

test('the live clock always uses Vietnam time, including midnight across a UTC date boundary', () => {
  assert.equal(formatVietnamTime(new Date('2026-10-23T16:45:00Z')), '23:45')
  assert.equal(formatVietnamTime(new Date('2026-10-23T17:05:00Z')), '00:05')
})

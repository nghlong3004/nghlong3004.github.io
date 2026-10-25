import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import test from 'node:test'
import { createServer } from 'vite'
import { experiences } from '../src/features/portfolio/data/experiences.ts'
import { profiles } from '../src/features/portfolio/data/profiles.ts'
import { projects } from '../src/features/portfolio/data/projects.ts'
import { stories } from '../src/features/portfolio/data/stories.ts'
import { impacts } from '../src/features/portfolio/data/impacts.ts'
import { labels } from '../src/features/portfolio/data/labels.ts'

const languages = ['vi', 'en']
const employerFacts = {
  vi: 'Đang làm việc tại VinFast',
  en: 'Currently working at VinFast',
}

function checkCurrentJob(data, language) {
  const current = data.filter(job => job.current)
  assert.equal(current.length, 1)
  // A boolean comparison keeps unapproved copy out of assertion failure output.
  assert.ok(isDeepStrictEqual(current[0], {
    company: 'VinFast',
    role: employerFacts[language],
    period: language === 'vi' ? 'Hiện tại' : 'Present',
    current: true,
    logo: '/company/VinFast.png',
    logoDark: '/company/VinFast-dark.png',
    tech: [],
    highlights: [],
  }), `${language}: current job must contain only approved employer facts`)
}

function checkEmployerReferences(value, path = '') {
  const approved = {
    'profile.intro': Object.values(employerFacts).map(fact => `${fact}.`),
    'experience.0.company': ['VinFast'],
    'experience.0.role': Object.values(employerFacts),
    'experience.0.logo': ['/company/VinFast.png'],
    'experience.0.logoDark': ['/company/VinFast-dark.png'],
  }
  if (typeof value === 'string' && /vinfast/i.test(value)) {
    assert.ok(approved[path]?.includes(value), 'Employer reference must be an approved fact at an approved data path')
  } else if (value && typeof value === 'object') {
    for (const [key, child] of Object.entries(value)) {
      checkEmployerReferences(child, path ? `${path}.${key}` : key)
    }
  }
}

test('both current-job records disclose only the approved employer fact', () => {
  for (const language of languages) {
    checkCurrentJob(experiences[language], language)
    assert.ok(profiles[language].intro === `${employerFacts[language]}.`)
    assert.ok(profiles[language].role === (language === 'vi' ? 'Lập trình viên' : 'Software Developer'))
  }
})

test('shared narrative has no employment metrics, project implementations or technical arrays', () => {
  for (const language of languages) {
    const story = stories[language]
    assert.ok(isDeepStrictEqual(Object.keys(story).sort(), ['intro', 'principles']))
    assert.ok(story.principles.length > 0)
    for (const principle of story.principles) {
      assert.ok(isDeepStrictEqual(Object.keys(principle).sort(), ['body', 'title']))
      assert.ok(typeof principle.title === 'string' && typeof principle.body === 'string')
    }
    const narrative = JSON.stringify({ bio: profiles[language].bio, story })
    assert.ok(!/[\d$€£%]|https?:|\b(?:ms|API|CI\/CD)\b/i.test(narrative), `${language}: narrative must stay nontechnical and nonquantified`)
    assert.ok(story.intro.includes('Boom Online') && story.intro.includes('Olympic HUMG'))
    assert.equal(labels[language].projectNotification, language === 'vi' ? 'Khám phá dự án' : 'Explore the project')
  }
})

test('shared metrics are limited to identified public projects and honors', () => {
  const approved = {
    vi: [
      { value: String(projects.vi.length), label: 'Dự án đã thiết kế & phát triển' },
      { value: '200ms', label: 'VinQA · Thời gian gửi yêu cầu quét, từ ~30s' },
      { value: '3', label: 'Lĩnh vực đạt giải: Giải tích, Đại số, Tin học' },
      { value: '6', label: 'Giải thưởng cấp Quốc gia & Tỉnh' },
    ],
    en: [
      { value: String(projects.en.length), label: 'Projects designed & built' },
      { value: '200ms', label: 'VinQA · Scan submission time, down from ~30s' },
      { value: '3', label: 'Award subjects: Calculus, Algebra, Informatics' },
      { value: '6', label: 'National & provincial contest prizes' },
    ],
  }
  for (const language of languages) {
    assert.ok(isDeepStrictEqual(impacts[language], approved[language]), `${language}: only approved public metrics may be shared`)
    assert.equal(Number(impacts[language][0].value), projects[language].length)
  }
})

test('assembled client data preserves sanitization and public history without alternate payloads', async () => {
  const server = await createServer({ configFile: false, optimizeDeps: { noDiscovery: true, include: [] }, server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  try {
    const { portfolio } = await server.ssrLoadModule('/src/features/portfolio/data/portfolio.ts')
    for (const language of languages) {
      const data = portfolio[language]
      assert.ok(isDeepStrictEqual(Object.keys(data).sort(), ['experience', 'honors', 'impact', 'links', 'profile', 'projects', 'story', 'ui']))
      for (const [key, source] of Object.entries({ experience: experiences, profile: profiles, projects, story: stories, impact: impacts, ui: labels })) {
        assert.ok(isDeepStrictEqual(data[key], source[language]), `${language}: assembled ${key} must match its source`)
      }
      checkCurrentJob(data.experience, language)
      checkEmployerReferences(data)
      for (const id of ['vinqa', 'vsf-qc-copilot', 'olympic-humg', 'boom-online']) {
        assert.ok(data.projects.some(project => project.id === id), 'existing public projects must be retained')
      }
      assert.ok(data.projects.every(project => project.techStack.length && project.details.length && project.role.length))
      const past = data.experience.find(job => job.company === 'Vinsmart Future')
      assert.ok(past && !past.current && past.tech.length && past.highlights.length)
      assert.equal(Number(data.impact[2].value), data.honors.length)
    }
  } finally { await server.close() }
})

test('static metadata introduces no current-employment payload', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8')
  assert.ok(html.includes('<title>Nguyen Hoang Long — Portfolio</title>'))
  assert.ok(!/vinfast|application\/ld\+json/i.test(html))
})

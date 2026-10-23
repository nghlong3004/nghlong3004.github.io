import type { Language, PortfolioData } from '../types'
import { profiles } from './profiles'
import { projects } from './projects'
import { stories } from './stories'
import { experiences } from './experiences'
import { honors } from './honors'
import { impacts } from './impacts'
import { links } from './links'
import { labels } from './labels'

function content(language: Language): PortfolioData {
  return {
    profile: profiles[language], projects: projects[language], story: stories[language],
    experience: experiences[language], honors: honors[language], impact: impacts[language],
    links, ui: labels[language],
  }
}

export const portfolio: Record<Language, PortfolioData> = {
  vi: content('vi'),
  en: content('en'),
}

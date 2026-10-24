import type { IconType } from 'react-icons'
import { FaJava } from 'react-icons/fa6'
import {
  SiDocker,
  SiFlyway,
  SiGitlab,
  SiLighthouse,
  SiNginx,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSpringboot,
  SiTypescript,
  SiVite,
} from 'react-icons/si'

type TechnologyIcon = { icon?: IconType; src?: string; title: string; color: string }

const icons: Record<string, TechnologyIcon> = {
  docker: { icon: SiDocker, title: 'Docker', color: '#2496ed' },
  flyway: { icon: SiFlyway, title: 'Flyway', color: '#cc0200' },
  gitlab: { icon: SiGitlab, title: 'GitLab', color: '#fc6d26' },
  java: { icon: FaJava, title: 'Java', color: '#5382a1' },
  lighthouse: { icon: SiLighthouse, title: 'Lighthouse', color: '#f44b21' },
  nginx: { icon: SiNginx, title: 'NGINX', color: '#009639' },
  'node.js': { icon: SiNodedotjs, title: 'Node.js', color: '#5fa04e' },
  postgresql: { icon: SiPostgresql, title: 'PostgreSQL', color: '#4169e1' },
  playwright: { src: '/technology/playwright.svg', title: 'Playwright', color: '#2ead33' },
  promptfoo: { src: '/technology/promptfoo.svg', title: 'Promptfoo', color: '#f75c4c' },
  python: { icon: SiPython, title: 'Python', color: '#3776ab' },
  react: { icon: SiReact, title: 'React', color: '#61dafb' },
  redis: { icon: SiRedis, title: 'Redis', color: '#d82c20' },
  'spring boot': { icon: SiSpringboot, title: 'Spring Boot', color: '#6db33f' },
  typescript: { icon: SiTypescript, title: 'TypeScript', color: '#3178c6' },
  vite: { icon: SiVite, title: 'Vite', color: '#646cff' },
}

const aliases: Record<string, string> = {
  'docker compose': 'docker',
  'java swing': 'java',
  'redis streams': 'redis',
}

export function getTechnologyIcon(label: string): TechnologyIcon | undefined {
  const normalized = label.trim().toLocaleLowerCase('en')
  const key = Object.hasOwn(aliases, normalized) ? aliases[normalized] : normalized
  return Object.hasOwn(icons, key) ? icons[key] : undefined
}

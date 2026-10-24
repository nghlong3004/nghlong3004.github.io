import type { PortfolioView } from '../types'

export function resolvePortfolioDestination(destination: string): { view: PortfolioView; target?: string; project?: string } {
  if (destination.startsWith('project-') && destination.length > 8) {
    return { view: 'projects', target: destination, project: destination.slice(8) }
  }
  if (destination === 'job-current') return { view: 'work', target: destination }
  if (destination === 'experience') return { view: 'work' }
  if (destination === 'intro') return { view: 'home' }
  if (destination === 'home' || destination === 'work' || destination === 'projects' || destination === 'about' || destination === 'contact') return { view: destination }
  return { view: 'home' }
}

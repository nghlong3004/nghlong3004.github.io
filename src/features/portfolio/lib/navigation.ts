import type { PortfolioView } from '../types'

export function resolvePortfolioDestination(destination: string): { view: PortfolioView; target?: string; project?: string } {
  if (destination.startsWith('project-') && destination.length > 8) {
    return { view: 'work', target: destination, project: destination.slice(8) }
  }
  if (destination === 'job-current') return { view: 'experience', target: destination }
  if (destination === 'projects' || destination === 'work') return { view: 'work' }
  if (destination === 'experience' || destination === 'contact') return { view: destination }
  return { view: 'about' }
}

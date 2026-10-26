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

export function isPortfolioNavigationNoop(
  current: { view: PortfolioView; target?: string; open: boolean },
  next: { view: PortfolioView; target?: string; project?: string },
  expandedProject: string | null,
): boolean {
  return current.open && current.view === next.view &&
    (current.target || 'view-root') === (next.target || 'view-root') &&
    (!next.project || next.project === expandedProject)
}

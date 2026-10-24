import type { PortfolioData } from '../../types'
import { ProjectsSection } from '../sections/ProjectsSection'

export function WorkView({ data, expandedProject, onToggle }: { data: PortfolioData; expandedProject: string | null; onToggle: (id: string) => void }) {
  return <>
    <header className="portfolio-view-header">
      <p className="portfolio-meta">{data.profile.displayName}</p>
      <div data-framer-component-type="RichTextContainer"><h1>{data.ui.projects}</h1></div>
    </header>
    <ProjectsSection data={data} expandedProject={expandedProject} onToggle={onToggle} />
    <section className="portfolio-section" data-ff-section="impact">
      <div data-framer-component-type="RichTextContainer"><h2>{data.ui.impact}</h2></div>
      <dl className="portfolio-impact">
        {data.impact.map(stat => <div key={stat.value}><dt>{stat.value}</dt><dd>{stat.label}</dd></div>)}
      </dl>
    </section>
  </>
}

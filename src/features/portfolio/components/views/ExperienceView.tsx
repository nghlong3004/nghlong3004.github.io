import type { PortfolioData } from '../../types'
import { ExperienceSection } from '../sections/ExperienceSection'

export function ExperienceView({ data }: { data: PortfolioData }) {
  return <>
    <header className="portfolio-view-header">
      <p className="portfolio-meta">{data.profile.displayName}</p>
      <div data-framer-component-type="RichTextContainer"><h1>{data.ui.experience}</h1></div>
    </header>
    <ExperienceSection data={data} />
    <section className="portfolio-section" data-ff-section="honors">
      <div data-framer-component-type="RichTextContainer"><h2>{data.ui.honors}</h2></div>
      {data.honors.map(honor => <article className="portfolio-honor" key={honor.id}>
        <div><h3>{honor.name}</h3><p className="portfolio-meta">{honor.period}</p></div>
        <p>{honor.description}</p>
      </article>)}
    </section>
  </>
}

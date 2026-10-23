import type { PortfolioData } from '../../types'

export function ExperienceSection({ data }: { data: PortfolioData }) {
  return (
    <section className="portfolio-section" data-ff-section="experience">
      <div data-framer-component-type="RichTextContainer"><h2>{data.ui.experience}</h2></div>
      {data.experience.map((job) => (
        <article className="portfolio-experience" key={job.company}>
          <div>
            {job.logo && <img className="portfolio-company" src={job.logo} alt={job.company} width="140" height="48" />}
            <h3>{job.company}</h3>
            <p className="portfolio-meta">{job.period}</p>
            {job.current && <p className="portfolio-current">{data.ui.current}</p>}
          </div>
          <div>
            <h4>{job.role}</h4>
            <ul>{job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
            <p className="portfolio-tech">{job.tech.join(' / ')}</p>
          </div>
        </article>
      ))}
    </section>
  )
}

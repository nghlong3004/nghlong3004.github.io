import type { PortfolioData } from '../../types'

export function ExperienceSection({ data }: { data: PortfolioData }) {
  return (
    <section className="portfolio-section" data-ff-section="experience" aria-label={data.ui.experience}>
      {data.experience.map((job) => (
        <article className="portfolio-experience" key={job.company} data-ff-section={job.current ? 'job-current' : undefined} tabIndex={-1} aria-label={job.company}>
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

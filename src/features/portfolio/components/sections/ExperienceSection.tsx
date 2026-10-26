import type { PortfolioData } from '../../types'

export function ExperienceSection({ data }: { data: PortfolioData }) {
  return (
    <section className="work-history" data-ff-surface data-ff-section="experience" aria-label={data.ui.experience}>
      {data.experience.map((job) => (
        <article className={`work-record work-record--${job.current ? 'current' : 'past'}`} key={job.company} data-ff-section={job.current ? 'job-current' : undefined} tabIndex={-1} aria-label={job.company}>
          <header className="work-record__header">
            {job.logo && <img className="work-record__logo" src={job.logo} alt={job.company} width="96" height="96" />}
            <div className="work-record__identity">
              <div data-framer-component-type="RichTextContainer"><h2>{job.company}</h2></div>
              {!job.current && <p className="work-record__meta">{job.period}</p>}
            </div>
          </header>
          {job.current ? <p>{job.role}</p> : <div className="work-record__details">
            <div data-framer-component-type="RichTextContainer"><h3>{job.role}</h3></div>
            {job.highlights.length > 0 && <ul>{job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
            {job.tech.length > 0 && <p className="work-record__meta">{job.tech.join(' / ')}</p>}
          </div>}
        </article>
      ))}
    </section>
  )
}

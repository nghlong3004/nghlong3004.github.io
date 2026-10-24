import type { PortfolioViewProps } from '../../types'
import { Icon } from '../Icon'
import { Portrait } from '../Portrait'
import { TechnologyLoop } from '../TechnologyLoop'
import '../../styles/home.css'

export function HomeView({ data, onNavigate, expandedProject, onToggle }: PortfolioViewProps) {
  const vi = data.ui.language === 'Ngôn ngữ'
  const copy = vi ? {
    selected: 'Dự án tiêu biểu', all: 'Tất cả dự án', details: 'Xem chi tiết',
    capabilities: 'Cách mình làm việc', employment: 'Kinh nghiệm',
    contact: 'Cùng trao đổi về dự án.',
  } : {
    selected: 'Selected work', all: 'All projects', details: 'View details',
    capabilities: 'How I work', employment: 'Experience',
    contact: 'Let’s talk about a project.',
  }

  return <div className="pf-page home-page" data-ff-surface>
    <header className="home-hero" data-ff-section="intro" data-ff-surface>
      <div className="home-hero__copy">
        <p className="pf-meta home-hero__role">{data.profile.role}<br />{data.profile.location}</p>
        <div className="home-hero__summary">
          <div data-framer-component-type="RichTextContainer"><h1 className="pf-name" aria-label={data.profile.name}>{data.profile.displayName}</h1></div>
          <p>{data.profile.intro}</p>
          <div className="home-actions">
            <button type="button" className="pf-action" onClick={() => onNavigate('work')}>{data.ui.explore}<Icon size={15} /></button>
            <button type="button" className="pf-action home-action--quiet" onClick={() => onNavigate('contact')}>{data.ui.contact}</button>
          </div>
        </div>
      </div>
      <div style={{ overflow: 'hidden' }} data-ff-surface><div data-framer-background-image-wrapper="true">
        <Portrait portrait={data.profile.portrait} className="home-hero__portrait" />
      </div></div>
    </header>

    <section className="home-impact" data-ff-section="impact" aria-label={data.ui.impact} data-ff-surface>
      <h2 className="pf-meta">{data.ui.impact}</h2>
      <dl className="pf-metrics">
        {data.impact.map(item => <div key={item.label}><dt data-framer-name="Count impact">{item.value}</dt><dd>{item.label}</dd></div>)}
      </dl>
    </section>

    <section className="pf-section home-work" data-ff-section="projects" data-ff-surface>
      <div className="home-section-heading">
        <div data-framer-component-type="RichTextContainer"><h2>{copy.selected}</h2></div>
        <button type="button" className="pf-action home-action--quiet" onClick={() => onNavigate('projects')}>{copy.all}<Icon size={15} /></button>
      </div>
      <div className="home-projects">
        {data.projects.map(project => <article key={project.id} className="home-project" data-ff-section={`project-${project.id}`} tabIndex={-1} aria-label={project.title}>
          <div style={{ overflow: 'hidden', borderRadius: 12 }}><div data-framer-background-image-wrapper="true">
            <img className="home-project__image" src={project.image.src} alt={project.image.alt} loading="lazy" />
          </div></div>
          <div className="home-project__copy">
            <p className="pf-meta">{project.category} · {project.year}</p>
            <div data-framer-component-type="RichTextContainer"><h3 className="pf-card-title">{project.title}</h3></div>
            <p>{project.summary}</p>
            <button type="button" className="pf-action" aria-label={`${copy.details}: ${project.title}`} aria-haspopup="dialog" aria-expanded={expandedProject === project.id} onClick={() => onToggle(project.id)}>{copy.details}<Icon size={15} /></button>
          </div>
        </article>)}
      </div>
    </section>

    <section className="pf-section home-capabilities" data-ff-section="capabilities">
      <div data-framer-component-type="RichTextContainer"><h2>{copy.capabilities}</h2></div>
      <div className="home-principles">
        {data.story.principles.map(principle => <article key={principle.title}>
          <h3 className="pf-card-title">{principle.title}</h3><p>{principle.body}</p>
        </article>)}
      </div>
    </section>

    <section className="pf-section home-tools" data-ff-section="tools">
      <div data-framer-component-type="RichTextContainer"><h2>{vi ? 'Công nghệ trong dự án' : 'Project technologies'}</h2></div>
      <TechnologyLoop technologies={[...new Set(data.projects.flatMap(project => project.techStack))]} syncKey="home-technologies" language={vi ? 'vi' : 'en'} />
    </section>

    <section className="pf-section home-employment" data-ff-section="employment">
      <div className="home-section-heading">
        <div data-framer-component-type="RichTextContainer"><h2>{copy.employment}</h2></div>
        <button type="button" className="pf-action" onClick={() => onNavigate('experience')}>{data.ui.experience}<Icon size={15} /></button>
      </div>
      <div className="home-employers">
        {data.experience.map(job => <article className="home-employer" key={job.company}>
          {job.logo ? <img src={job.logo} alt={job.company} loading="lazy" /> : null}
          <div><h3 className="pf-card-title">{job.company}</h3><p>{job.role}</p><p className="pf-meta">{job.period}</p></div>
        </article>)}
      </div>
    </section>

    <section className="pf-section home-contact" data-ff-section="contact" data-ff-surface>
      <div data-framer-component-type="RichTextContainer"><h2>{copy.contact}</h2></div>
      <button type="button" className="pf-action pf-action--accent" onClick={() => onNavigate('contact')}>{data.ui.contact}<Icon size={15} /></button>
    </section>
  </div>
}

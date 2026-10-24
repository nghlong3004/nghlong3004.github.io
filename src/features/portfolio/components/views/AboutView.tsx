import type { PortfolioViewProps } from '../../types'
import { Portrait } from '../Portrait'
import { Icon } from '../Icon'
import { TechnologyLoop } from '../TechnologyLoop'
import { Mark, MarkerText } from '../kokonut/MarkerText'
import '../../styles/about.css'

export function AboutView({ data, onNavigate }: PortfolioViewProps) {
  const vi = data.ui.language === 'Ngôn ngữ'
  const technologies = [...new Set(data.projects.flatMap(project => project.techStack))]

  return <article className="pf-page about-view" data-ff-surface>
    <header className="about-view__hero" data-ff-section="intro" data-ff-surface>
      <div style={{ overflow: 'hidden' }} data-ff-surface><div data-framer-background-image-wrapper="true">
        <Portrait portrait={data.profile.portrait} className="about-view__portrait" />
      </div></div>
      <div className="about-view__copy pf-page--dark" data-ff-surface>
        <div className="pf-header">
          <div data-framer-component-type="RichTextContainer"><h1>{vi ? 'TỪ SỞ THÍCH' : 'FROM INTEREST'}<span>{vi ? 'ĐẾN DỰ ÁN.' : 'TO PROJECTS.'}</span></h1></div>
          <p>{data.profile.name}<br />{data.profile.role}</p>
        </div>
        <div className="about-view__introduction">
          <MarkerText as="p" show><Mark>{data.profile.intro}</Mark></MarkerText>
          <p>{data.profile.bio}</p>
          <div className="about-view__actions">
            <button type="button" className="pf-action pf-action--accent" onClick={() => onNavigate('contact')}>{data.ui.contact} <Icon size={15} /></button>
          </div>
        </div>
      </div>
    </header>

    <section className="about-view__numbers" data-ff-section="about-impact" data-ff-surface>
      <h2 className="pf-meta">{data.ui.impact}</h2>
      <dl className="pf-metrics">
        {data.impact.map(metric => <div key={metric.label}><dt data-framer-name="Count impact">{metric.value}</dt><dd>{metric.label}</dd></div>)}
      </dl>
    </section>

    <div className="about-view__body" data-ff-surface>
      <section className="pf-section about-view__story" data-ff-section="story">
        <div data-framer-component-type="RichTextContainer"><h2>{data.ui.story}</h2></div>
        <p>{data.story.intro}</p>
      </section>

      <section className="pf-section" data-ff-section="about-capabilities">
        <div className="about-view__section-heading">
          <div data-framer-component-type="RichTextContainer"><h2>{vi ? 'CÁCH MÌNH LÀM' : 'HOW I BUILD'}</h2></div>
          <p className="pf-meta">{data.profile.location}</p>
        </div>
        <div className="about-view__principles">
          {data.story.principles.map(principle => <div key={principle.title}>
            <h3 className="pf-card-title">{principle.title}</h3>
            <p>{principle.body}</p>
          </div>)}
        </div>
        <h3 className="about-view__tools-heading pf-meta">{vi ? 'Công nghệ đã sử dụng' : 'Tools I work with'}</h3>
        <TechnologyLoop technologies={technologies} syncKey="about-technologies" language={vi ? 'vi' : 'en'} />
      </section>

      <section className="pf-section" data-ff-section="about-honors">
        <div data-framer-component-type="RichTextContainer"><h2>{data.ui.honors}</h2></div>
        <ul className="about-view__honors">
          {data.honors.map(honor => <li key={honor.id}>
            <h3 className="pf-card-title">{honor.name}</h3>
            <div><p className="pf-meta">{honor.period}</p><p>{honor.description}</p></div>
          </li>)}
        </ul>
      </section>

      <section className="pf-section" data-ff-section="about-employers">
        <div className="about-view__section-heading">
          <div data-framer-component-type="RichTextContainer"><h2>{data.ui.experience}</h2></div>
          <button type="button" className="pf-action" onClick={() => onNavigate('experience')}>{data.ui.experience} <Icon size={15} /></button>
        </div>
        <ul className="about-view__employers">
          {data.experience.map(job => <li key={job.company}>
            {job.logo ? <img src={job.logo} alt={job.company} loading="lazy" /> : null}
            <div><h3 className="pf-card-title">{job.company}</h3><p>{job.role}</p><p className="pf-meta">{job.period}</p></div>
          </li>)}
        </ul>
      </section>

      <section className="pf-section about-view__contact" data-ff-section="about-contact" data-ff-surface>
        <div data-framer-component-type="RichTextContainer"><h2>{data.ui.contactHeading}</h2></div>
        <p>{data.ui.contactIntro}</p>
        <button type="button" className="pf-action" onClick={() => onNavigate('contact')}>{data.ui.contact} <Icon size={15} /></button>
      </section>
    </div>
  </article>
}

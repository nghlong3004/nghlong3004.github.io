import type { CSSProperties } from 'react'
import type { PortfolioData } from '../types'
import { ExperienceSection } from './sections/ExperienceSection'
import { ProjectsSection } from './sections/ProjectsSection'
import { Portrait } from './Portrait'
import { Icon } from './Icon'

export function PortfolioScreen({ data, compact = false, expandedProject, onToggle, onNavigate, style }: {
  data: PortfolioData
  compact?: boolean
  expandedProject: string | null
  onToggle: (id: string) => void
  onNavigate: (section: string) => void
  style?: CSSProperties
}) {
  return (
    <div className={`portfolio-screen${compact ? ' portfolio-screen--compact' : ''}`} style={style}>
      <header className="portfolio-intro" data-ff-section="intro">
        <div className="portfolio-intro__copy">
          <p className="portfolio-role">{data.profile.role}<br />{data.profile.location}</p>
          <div className="portfolio-intro__summary">
            <div data-framer-component-type="RichTextContainer"><h1>{data.profile.name}</h1></div>
            <p>{data.profile.intro}</p>
            <div className="portfolio-actions">
              <button type="button" onClick={() => onNavigate('projects')}>{data.ui.explore} <Icon size={15} /></button>
              <button type="button" className="portfolio-text-button" onClick={() => onNavigate('contact')}>{data.ui.contact}</button>
            </div>
          </div>
        </div>
        <Portrait portrait={data.profile.portrait} className="portfolio-intro__portrait" />
      </header>

      <section className="portfolio-section" data-ff-section="story">
        <div data-framer-component-type="RichTextContainer"><h2>{data.ui.story}</h2></div>
        <p className="portfolio-story-intro">{data.story.intro}</p>
        <div className="portfolio-principles">
          {data.story.principles.map((principle) => <div key={principle.title}><h3>{principle.title}</h3><p>{principle.body}</p></div>)}
        </div>
      </section>

      <ExperienceSection data={data} />
      <ProjectsSection data={data} expandedProject={expandedProject} onToggle={onToggle} />

      <section className="portfolio-section" data-ff-section="impact">
        <div data-framer-component-type="RichTextContainer"><h2>{data.ui.impact}</h2></div>
        <dl className="portfolio-impact">
          {data.impact.map((stat) => <div key={stat.value}><dt>{stat.value}</dt><dd>{stat.label}</dd></div>)}
        </dl>
      </section>

      <section className="portfolio-section" data-ff-section="honors">
        <div data-framer-component-type="RichTextContainer"><h2>{data.ui.honors}</h2></div>
        {data.honors.map((honor) => <article className="portfolio-honor" key={honor.id}>
          <div><h3>{honor.name}</h3><p className="portfolio-meta">{honor.period}</p></div>
          <p>{honor.description}</p>
        </article>)}
      </section>

      <footer className="portfolio-section portfolio-footer" data-ff-section="contact">
        <div data-framer-component-type="RichTextContainer"><h2>{data.ui.contactHeading}</h2></div>
        <p>{data.ui.contactIntro}</p>
        <a className="portfolio-email" href={`mailto:${data.profile.email}`}>{data.profile.email} <Icon size={24} /></a>
        <div className="portfolio-socials">{data.links.filter((link) => link.label !== 'Email').map((link) => <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <Icon size={14} /></a>)}</div>
        <p className="portfolio-signature">{data.profile.name}</p>
      </footer>
    </div>
  )
}

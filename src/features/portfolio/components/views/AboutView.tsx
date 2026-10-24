import type { PortfolioData } from '../../types'
import { Portrait } from '../Portrait'
import { Icon } from '../Icon'
import { Mark, MarkerText } from '../kokonut/MarkerText'

export function AboutView({ data, onNavigate }: { data: PortfolioData; onNavigate: (destination: string) => void }) {
  return <>
    <header className="portfolio-intro" data-ff-section="intro">
      <div className="portfolio-intro__copy">
        <p className="portfolio-role">{data.profile.role}<br />{data.profile.location}</p>
        <div className="portfolio-intro__summary">
          <div data-framer-component-type="RichTextContainer"><h1 aria-label={data.profile.name}>{data.profile.displayName.split(' ').map(word => <span key={word}>{word} </span>)}</h1></div>
          <MarkerText as="p" show><Mark>{data.profile.intro}</Mark></MarkerText>
          <div className="portfolio-actions">
            <button type="button" onClick={() => onNavigate('work')}>{data.ui.explore} <Icon size={15} /></button>
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
        {data.story.principles.map(principle => <div key={principle.title}><h3>{principle.title}</h3><p>{principle.body}</p></div>)}
      </div>
    </section>
  </>
}

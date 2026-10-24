import type { PortfolioData } from '../../types'
import { Icon } from '../Icon'

export function ContactView({ data }: { data: PortfolioData }) {
  return <footer className="portfolio-section portfolio-footer" data-ff-section="contact">
    <p className="portfolio-meta">{data.ui.contact}</p>
    <div data-framer-component-type="RichTextContainer"><h1>{data.ui.contactHeading}</h1></div>
    <p>{data.ui.contactIntro}</p>
    <a className="portfolio-email" href={`mailto:${data.profile.email}`}>{data.profile.email} <Icon size={24} /></a>
    <div className="portfolio-socials">{data.links.filter(link => link.label !== 'Email').map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer"><Icon name={link.icon} size={18} />{link.label}</a>)}</div>
    <p className="portfolio-signature">{data.profile.name}</p>
  </footer>
}

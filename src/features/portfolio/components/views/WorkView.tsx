import type { PortfolioViewProps } from '../../types'
import { Icon } from '../Icon'
import { ExperienceSection } from '../sections/ExperienceSection'
import '../../styles/work.css'

export function WorkView({ data, onNavigate }: PortfolioViewProps) {
  const vi = data.ui.language === 'Ngôn ngữ'

  return <div className="pf-page pf-work" data-ff-surface>
    <header className="pf-header">
      <div data-framer-component-type="RichTextContainer"><h1>{data.ui.work}</h1></div>
      <p className="pf-work__intro">{vi
        ? 'Nơi tôi đang làm việc và kinh nghiệm từ kỳ thực tập trước đây.'
        : 'Where I work now and experience from my previous internship.'}</p>
    </header>
    <ExperienceSection data={data} />
    <footer className="work-footer" data-ff-surface>
      <div>
        <div data-framer-component-type="RichTextContainer"><h2>{data.ui.contactHeading}</h2></div>
        <p>{data.ui.contactIntro}</p>
      </div>
      <button type="button" className="pf-action" onClick={() => onNavigate('contact')}>{data.ui.contact}<Icon size={15} /></button>
    </footer>
  </div>
}

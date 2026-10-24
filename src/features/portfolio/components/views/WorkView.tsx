import type { PortfolioViewProps } from '../../types'
import { ExperienceSection } from '../sections/ExperienceSection'
import '../../styles/work.css'

export function WorkView({ data }: PortfolioViewProps) {
  const vi = data.ui.language === 'Ngôn ngữ'

  return <div className="pf-page pf-work" data-ff-surface>
    <header className="pf-header">
      <div data-framer-component-type="RichTextContainer"><h1>{data.ui.work}</h1></div>
      <p className="pf-work__intro">{vi
        ? 'Nơi tôi đang làm việc và kinh nghiệm từ kỳ thực tập trước đây.'
        : 'Where I work now and experience from my previous internship.'}</p>
    </header>
    <ExperienceSection data={data} />
  </div>
}

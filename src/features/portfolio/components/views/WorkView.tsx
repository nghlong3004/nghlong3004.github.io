import type { PortfolioViewProps } from '../../types'
import { Icon } from '../Icon'
import '../../styles/work.css'

export function WorkView({ data, onNavigate, onToggle, workFilter, onWorkFilterChange }: PortfolioViewProps) {
  const vi = data.ui.language === 'Ngôn ngữ'
  const categories = data.projects.filter((project, index, projects) => projects.findIndex(item => item.category === project.category) === index)
  const selectedCategory = categories.find(project => project.id === workFilter)?.category
  const visibleProjects = selectedCategory ? data.projects.filter(project => project.category === selectedCategory) : data.projects
  const years = [...new Set(data.projects.map(project => project.year))].sort()

  return <div className="pf-page pf-work" data-ff-surface>
    <header className="pf-header pf-work__header">
      <div className="pf-work__title-row">
        <div data-framer-component-type="RichTextContainer"><h1>{data.ui.work}</h1></div>
        <p className="pf-meta">{vi ? 'Dự án chọn lọc' : 'Selected projects'} · {years.join('—')}</p>
      </div>
      <p className="pf-work__intro">{vi
        ? 'Từ nền tảng kiểm thử AI đến giáo dục và game thời gian thực. Mở một dự án để xem câu chuyện và cách triển khai.'
        : 'From AI testing platforms to education and real-time games. Open a project for the story and the engineering behind it.'}</p>
      <div className="pf-work__filters" role="group" aria-label={vi ? 'Lọc dự án theo lĩnh vực' : 'Filter projects by category'}>
        <button type="button" className="pf-action" aria-pressed={!selectedCategory} onClick={() => onWorkFilterChange('all')}>{vi ? 'Tất cả' : 'All'}</button>
        {categories.map(project => <button type="button" className="pf-action" key={project.id}
          aria-pressed={selectedCategory === project.category} onClick={() => onWorkFilterChange(project.id)}>{project.category}</button>)}
      </div>
    </header>
    <section className="pf-work__grid" data-ff-section="projects" aria-label={data.ui.projects}>
      {visibleProjects.map(project => <article className="pf-work__project" key={project.id} tabIndex={-1} data-ff-section={`project-${project.id}`} aria-label={project.title}>
        <button type="button" className="pf-work__card" aria-haspopup="dialog" aria-label={`${vi ? 'Xem dự án' : 'Open project'} ${project.title}`} onClick={() => onToggle(project.id)}>
          <div className={`pf-work__image${project.id === 'vinqa' || project.id === 'vsf-qc-copilot' || project.id === 'olympic-humg' ? ' pf-work__image--logo' : ''}`} data-framer-background-image-wrapper="true">
            <img src={project.image.src} alt={project.image.alt} loading="lazy" />
          </div>
          <div className="pf-work__caption">
            <h3 className="pf-card-title">{project.title}</h3><span className="pf-meta">{project.year}</span>
            <p>{project.outcome}</p><span className="pf-meta">{project.category}</span>
          </div>
        </button>
      </article>)}
    </section>
    <section className="pf-section pf-work__index" aria-label={vi ? 'Mục lục dự án' : 'Project index'}>
      <div className="pf-work__index-header pf-meta"><p>{vi ? 'Mục lục' : 'Index'}</p><p>{vi ? 'Dự án · Vai trò · Năm' : 'Project · Role · Year'}</p></div>
      {visibleProjects.map((project, index) => <button type="button" className="pf-work__index-row" key={project.id}
        aria-haspopup="dialog" aria-label={`${vi ? 'Xem dự án' : 'Open project'} ${project.title}`} onClick={() => onToggle(project.id)}>
        <span className="pf-meta">{String(index + 1).padStart(2, '0')}</span>
        <span className="pf-card-title">{project.title}</span><span className="pf-work__index-outcome">{project.outcome}</span>
        <span className="pf-meta">{project.year}</span><Icon size={16} />
      </button>)}
    </section>
    <section className="pf-section" data-ff-section="impact">
      <div data-framer-component-type="RichTextContainer"><h2>{data.ui.impact}</h2></div>
      <dl className="pf-metrics pf-work__metrics" data-ff-surface>{data.impact.map(stat => <div key={stat.label}><dt data-framer-name="Count impact">{stat.value}</dt><dd>{stat.label}</dd></div>)}</dl>
    </section>
    <section className="pf-section pf-work__contact" data-ff-surface>
      <div data-framer-component-type="RichTextContainer"><h2>{vi ? 'Cùng xây điều tiếp theo.' : 'Let’s build what’s next.'}</h2></div>
      <button type="button" className="pf-action" onClick={() => onNavigate('contact')}>{data.ui.contact}<Icon size={16} /></button>
    </section>
  </div>
}

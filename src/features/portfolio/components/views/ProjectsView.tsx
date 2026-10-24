import type { PortfolioViewProps } from '../../types'
import { Icon } from '../Icon'
import '../../styles/projects.css'

export function ProjectsView({ data, expandedProject, onToggle, onNavigate }: PortfolioViewProps) {
  const vi = data.ui.language === 'Ngôn ngữ'

  return <div className="pf-page pf-projects" data-ff-surface>
    <header className="pf-header pf-projects__header">
      <div className="pf-projects__heading">
        <div data-framer-component-type="RichTextContainer"><h1>{data.ui.archive}</h1></div>
        <p className="pf-meta">{vi ? 'Giao diện · Kiểm thử AI · Trò chơi' : 'Interfaces · AI testing · Games'}</p>
      </div>
      <p className="pf-projects__intro">{vi
        ? 'Một số dự án về kiểm thử phần mềm, giáo dục, trò chơi và công cụ cộng đồng. Mở từng dự án để xem mô tả, phần đóng góp và liên kết.'
        : 'A selection of projects in software testing, education, games and community tools. Open a project to read its overview, contribution and links.'}</p>
    </header>

    <section className="pf-projects__gallery" data-ff-section="projects" aria-label={data.ui.gallery}>
      {data.projects.map(project => <figure
        className="pf-projects__tile"
        key={project.id}
        data-ff-section={`project-${project.id}`}
      >
        <button
          className="pf-projects__image"
          type="button"
          onClick={() => onToggle(project.id)}
          aria-haspopup="dialog"
          aria-expanded={expandedProject === project.id}
          aria-label={`${data.ui.open}: ${project.title}`}
        >
          <div data-framer-background-image-wrapper="true" style={{ height: '100%' }}><img
            src={project.image.src}
            alt={project.image.alt}
            loading="lazy"
            decoding="async"
          /></div>
          <span className="pf-projects__open" aria-hidden="true"><Icon /></span>
        </button>
        <figcaption>
          <div className="pf-projects__caption"><span>{project.title}</span><span className="pf-meta">{project.year}</span></div>
          <p className="pf-meta pf-projects__category">{project.category}</p>
        </figcaption>
      </figure>)}
    </section>

    <section className="pf-section pf-projects__close">
      <div data-framer-component-type="RichTextContainer"><h2>{vi ? 'Cùng xây dựng điều tiếp theo.' : 'Let’s build what’s next.'}</h2></div>
      <button className="pf-action" type="button" onClick={() => onNavigate('contact')}>
        {data.ui.contact}<Icon />
      </button>
    </section>
  </div>
}

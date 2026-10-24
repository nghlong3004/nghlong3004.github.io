import type { PortfolioViewProps } from '../../types'
import { Icon } from '../Icon'
import '../../styles/projects.css'

export function ProjectsView({ data, expandedProject, onToggle, onNavigate }: PortfolioViewProps) {
  const vi = data.ui.language === 'Ngôn ngữ'
  const tiles = data.projects.flatMap(project =>
    [...new Set([project.image.src, ...project.images])].map((src, imageIndex) => ({ project, src, imageIndex })),
  ).sort((a, b) => a.imageIndex - b.imageIndex)

  return <div className="pf-page pf-page--dark pf-projects" data-ff-surface>
    <header className="pf-header pf-projects__header">
      <div className="pf-projects__heading">
        <div data-framer-component-type="RichTextContainer"><h1>{data.ui.archive}</h1></div>
        <p className="pf-meta">{vi ? 'Giao diện · Kiểm thử AI · Trò chơi' : 'Interfaces · AI testing · Games'}</p>
      </div>
      <p className="pf-projects__intro">{vi
        ? 'Hình ảnh từ các dự án kiểm thử AI, giáo dục và trò chơi. Mở từng hình để xem dự án và vai trò của tôi.'
        : 'A visual archive of AI testing, education and game projects. Open an image to explore the project and my role.'}</p>
    </header>

    <section className="pf-projects__gallery" data-ff-section="projects" aria-label={data.ui.gallery}>
      {tiles.map(({ project, src, imageIndex }) => <figure
        className="pf-projects__tile"
        key={`${project.id}-${src}`}
        data-ff-section={imageIndex === 0 ? `project-${project.id}` : undefined}
      >
        <button
          className="pf-projects__image"
          type="button"
          onClick={() => onToggle(project.id)}
          aria-haspopup="dialog"
          aria-expanded={expandedProject === project.id}
          aria-label={`${data.ui.open}: ${project.title} — ${data.ui.gallery} ${imageIndex + 1}`}
        >
          <div data-framer-background-image-wrapper="true" style={{ height: '100%' }}><img
            src={src}
            alt={imageIndex === 0 ? project.image.alt : `${project.title} — ${data.ui.gallery} ${imageIndex}`}
            loading={imageIndex === 0 ? 'eager' : 'lazy'}
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

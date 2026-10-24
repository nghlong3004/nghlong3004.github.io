import { useId } from 'react'
import type { PortfolioData } from '../../types'
import { ContentBlocks } from '../ContentBlocks'
import { Icon } from '../Icon'

export function ProjectsSection({ data, expandedProject, onToggle }: {
  data: PortfolioData
  expandedProject: string | null
  onToggle: (id: string) => void
}) {
  const prefix = useId()
  return (
    <section className="portfolio-section portfolio-projects" data-ff-section="projects" aria-label={data.ui.projects}>
      {data.projects.map((project) => {
        const expanded = expandedProject === project.id
        const panelId = `${prefix}-${project.id}`
        return (
          <article key={project.id} className="portfolio-project" data-ff-section={`project-${project.id}`} tabIndex={-1} aria-label={project.title}>
            <div className="portfolio-project__overview">
              <div className="portfolio-project__image" data-framer-background-image-wrapper="">
                <img src={project.image.src} alt={project.image.alt} width="960" height="600" loading="lazy" />
              </div>
              <div className="portfolio-project__info">
                <p className="portfolio-meta">{project.year} · {project.category}</p>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <p className="portfolio-tech">{project.techStack.join(' / ')}</p>
                <div className="portfolio-actions">
                  <button type="button" aria-expanded={expanded} aria-controls={panelId} onClick={() => onToggle(project.id)}>
                    {expanded ? data.ui.less : data.ui.more} <Icon name={expanded ? 'minus' : 'plus'} size={15} />
                  </button>
                  {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer">{data.ui.live} <Icon size={14} /></a>}
                  {project.sourceCode && <a href={project.sourceCode} target="_blank" rel="noreferrer">GitHub <Icon size={14} /></a>}
                </div>
              </div>
            </div>
            <div id={panelId} className="portfolio-project__details" hidden={!expanded}>
              {expanded && <>
                {project.tagline && <p className="portfolio-project__tagline">{project.tagline}</p>}
                <ContentBlocks blocks={project.details} />
                <h4>{data.ui.role}</h4>
                <ContentBlocks blocks={project.role} />
                <div className="portfolio-gallery" aria-label={data.ui.gallery}>
                  {project.images.map((src, index) => <img key={src} src={src} alt={`${project.title} — ${index + 1}`} width="960" height="600" loading="lazy" />)}
                </div>
              </>}
            </div>
          </article>
        )
      })}
    </section>
  )
}

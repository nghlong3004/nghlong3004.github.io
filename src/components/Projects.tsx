import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useLanguage } from "../hooks/useLanguage";
import { Eyebrow } from "./Eyebrow";
import { LiquidImage } from "./LiquidImage";
import { RevealText } from "./RevealText";

import { ArrowUpRight } from "lucide-react";

interface ProjectsProps {
  onSelectProject?: (id: string) => void;
}

export function Projects({ onSelectProject }: ProjectsProps = {}) {
  const reducedMotion = usePrefersReducedMotion();
  const { ref: sectionRef, inView } = useInView<HTMLElement>();
  const { t, language } = useLanguage();

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="py-section px-gutter"
      aria-label="Selected Projects"
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <Eyebrow label={t.projects.eyebrow} />
          <RevealText
            key={`projects-heading-${language}`}
            as="h2"
            text={t.projects.heading}
            mode="lines"
            triggered={inView}
            className="mt-6 max-w-[14ch] font-display uppercase leading-[0.95] tracking-[-0.01em] text-h2 sm:text-h1 text-foreground"
          />
        </div>
        <span className="text-eyebrow uppercase tracking-[0.22em] text-muted self-start sm:self-end">
          {t.projects.counter}
        </span>
      </div>

      {/* Projects Grid */}
      <ul className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-gutter gap-y-16">
        {t.projects.projects.map((project, idx: number) => {
          const isOdd = idx % 2 === 1;
          const delay = (isOdd ? 120 : 0) + Math.floor(idx / 2) * 150;

          return (
            <li
              key={project.id}
              className={isOdd ? "md:mt-24" : ""}
              style={{
                opacity: reducedMotion || inView ? 1 : 0,
                transform:
                  reducedMotion || inView
                    ? "translateY(0)"
                    : "translateY(60px)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 620ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 620ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              }}
            >
              <article
                className="group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
                onClick={() => {
                  if (onSelectProject) {
                    onSelectProject(project.id);
                  } else {
                    window.location.hash = `#/project/${project.id}`;
                  }
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (onSelectProject) {
                      onSelectProject(project.id);
                    } else {
                      window.location.hash = `#/project/${project.id}`;
                    }
                  }
                }}
              >
                {/* Liquid Image */}
                <LiquidImage
                  src={project.image}
                  alt={project.name}
                  placeholderLabel={project.name}
                  aspectRatio="16/11"
                  maxScale={28}
                  className="w-full rounded-[0.125rem]"
                />

                {/* Details Row */}
                <div className="mt-6 border-t border-line pt-5 flex items-start justify-between gap-6">
                  {/* Left: Name + Blurb */}
                  <div>
                    <h3 className="font-sans text-h3 font-semibold tracking-[-0.01em] text-foreground transition-colors duration-340 ease-out group-hover:text-accent flex items-center gap-2">
                      <span>{project.name}</span>
                      <ArrowUpRight className="size-5 opacity-0 -translate-x-1.5 translate-y-1.5 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 text-accent" />
                    </h3>
                    <p className="mt-2 max-w-[42ch] text-body text-muted">
                      {project.blurb}
                    </p>
                  </div>

                  {/* Right: Year + Outcome */}
                  <div className="shrink-0 text-right">
                    <span className="text-eyebrow uppercase tracking-[0.18em] text-muted block">
                      {project.year}
                    </span>
                    <span className="mt-2 text-eyebrow font-medium uppercase tracking-[0.18em] text-accent block">
                      {project.outcome}
                    </span>
                  </div>
                </div>

                {/* Category below row */}
                <p className="mt-3 text-eyebrow uppercase tracking-[0.22em] text-muted">
                  {project.category}
                </p>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

import { useRef } from "react";
import parse from "html-react-parser";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { useLanguage } from "../hooks/useLanguage";
import type { ProjectItemTranslation } from "../i18n/types";
import { TechIcon } from "./TechIcon";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface ProjectDetailsProps {
  project: ProjectItemTranslation;
  onBack: () => void;
}

export function ProjectDetails({ project, onBack }: ProjectDetailsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.set(".fade-in-later", {
        autoAlpha: 0,
        y: 28,
      });

      const tl = gsap.timeline({
        delay: 0.2,
      });

      tl.to(".fade-in-later", {
        autoAlpha: 1,
        y: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
      });
    },
    { scope: containerRef }
  );

  // Blur info section and scale on scroll on desktop
  useGSAP(
    () => {
      if (typeof window === "undefined" || window.innerWidth < 992) return;

      const trigger = ScrollTrigger.create({
        trigger: "#info",
        start: "bottom bottom",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        scrub: 0.5,
        animation: gsap.to("#info", {
          filter: "blur(4px)",
          autoAlpha: 0,
          scale: 0.94,
          ease: "none",
        }),
      });

      return () => {
        trigger.kill();
      };
    },
    { scope: containerRef }
  );

  // Parallax effect on images
  useGSAP(
    () => {
      const imageDivs = gsap.utils.toArray<HTMLDivElement>("#images > div");
      if (!imageDivs.length) return;

      const triggers: ScrollTrigger[] = [];

      imageDivs.forEach((imageDiv, i) => {
        const anim = gsap.to(imageDiv, {
          backgroundPosition: "center 0%",
          ease: "none",
          scrollTrigger: {
            trigger: imageDiv,
            start: () => (i ? "top bottom" : "top 60%"),
            end: "bottom top",
            scrub: true,
          },
        });
        if (anim.scrollTrigger) {
          triggers.push(anim.scrollTrigger);
        }
      });

      return () => {
        triggers.forEach((st) => st.kill());
      };
    },
    { scope: containerRef }
  );

  return (
    <section className="pt-24 pb-20 px-gutter min-h-screen">
      <div className="max-w-5xl mx-auto" ref={containerRef}>
        {/* Back navigation */}
        <button
          type="button"
          onClick={onBack}
          className="fade-in-later mb-12 inline-flex items-center gap-3 px-4 py-2 rounded-full border border-line bg-surface/50 text-foreground hover:border-accent hover:text-accent hover:bg-surface/80 transition-all duration-300 group cursor-pointer"
          aria-label={t.projects.detail.back}
        >
          <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-eyebrow font-medium uppercase tracking-[0.2em]">
            {t.projects.detail.back}
          </span>
        </button>

        {/* Info header & metadata */}
        <div className="top-0 min-h-[calc(100svh-140px)] flex flex-col justify-start" id="info">
          <div className="relative w-full">
            {/* Title + Action Links */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-8 border-b border-line mb-10">
              <div>
                <span className="text-eyebrow uppercase tracking-[0.22em] text-accent block mb-2 font-medium">
                  {project.category}
                </span>
                <h1 className="fade-in-later text-4xl sm:text-5xl md:text-[64px] font-display uppercase tracking-[-0.01em] text-foreground leading-[0.95]">
                  {project.title}
                </h1>
                {project.tagline && (
                  <p className="fade-in-later mt-4 text-lead text-muted max-w-[50ch]">
                    {project.tagline}
                  </p>
                )}
              </div>

              {/* Action buttons (GitHub / Live Site) */}
              <div className="fade-in-later flex flex-wrap items-center gap-3 shrink-0">
                {project.sourceCode && (
                  <a
                    href={project.sourceCode}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="h-11 px-4 rounded-full border border-line bg-surface/50 inline-flex items-center gap-2.5 text-foreground/90 hover:text-accent hover:border-accent hover:bg-surface transition-all duration-200 text-sm font-medium"
                    title={
                      project.id === "olympic-humg"
                        ? language === "vi"
                          ? "Tài liệu kỹ thuật (GitHub)"
                          : "Technical Documentation (GitHub)"
                        : t.projects.detail.view_code
                    }
                    aria-label={t.projects.detail.view_code}
                  >
                    <SiGithub size={18} />
                    <span>
                      {project.id === "olympic-humg"
                        ? language === "vi"
                          ? "Tài liệu (GitHub)"
                          : "Documentation"
                        : "GitHub"}
                    </span>
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="h-11 px-4 rounded-full border border-line bg-surface/50 inline-flex items-center gap-2.5 text-foreground/90 hover:text-accent hover:border-accent hover:bg-surface transition-all duration-200 text-sm font-medium"
                    title={t.projects.detail.visit_website}
                    aria-label={t.projects.detail.visit_website}
                  >
                    <ExternalLink size={18} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            {/* Structured details */}
            <div className="space-y-10 pb-16 max-w-3xl">
              {/* Year */}
              <div className="fade-in-later">
                <p className="text-eyebrow uppercase tracking-[0.22em] text-muted mb-2 font-medium">
                  {t.projects.detail.year}
                </p>
                <div className="text-lg font-medium text-foreground">
                  {project.year}
                </div>
              </div>

              {/* Tech Stack */}
              <div className="fade-in-later">
                <p className="text-eyebrow uppercase tracking-[0.22em] text-muted mb-3 font-medium">
                  {t.projects.detail.tech}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/40 px-3 py-1 text-xs sm:text-sm font-medium text-foreground/80 hover:text-foreground hover:border-line-strong transition-colors"
                    >
                      <TechIcon name={tag} className="size-3.5 shrink-0" />
                      <span>{tag}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="fade-in-later">
                <p className="text-eyebrow uppercase tracking-[0.22em] text-muted mb-3 font-medium">
                  {t.projects.detail.description}
                </p>
                <div className="text-body sm:text-lead text-foreground/85 markdown-text leading-relaxed">
                  {parse(project.description)}
                </div>
              </div>

              {/* Role */}
              {project.role && (
                <div className="fade-in-later">
                  <p className="text-eyebrow uppercase tracking-[0.22em] text-muted mb-3 font-medium">
                    {t.projects.detail.role}
                  </p>
                  <div className="text-body sm:text-lead text-foreground/85 markdown-text leading-relaxed">
                    {parse(project.role)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Gallery / Images */}
        {project.images && project.images.length > 0 && (
          <div
            className="fade-in-later relative flex flex-col gap-6 max-w-4xl mx-auto pt-6"
            id="images"
          >
            {project.images.map((image, idx) => (
              <div
                key={`${image}-${idx}`}
                className="group relative w-full aspect-video overflow-hidden rounded-2xl border border-line bg-surface-2 shadow-2xl transition-all duration-500"
                style={{
                  backgroundImage: `url(${image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center 50%",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <a
                  href={image}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="absolute top-5 right-5 bg-background/80 backdrop-blur-md text-foreground size-12 rounded-full inline-flex justify-center items-center transition-all opacity-0 hover:bg-primary hover:text-primary-foreground group-hover:opacity-100 shadow-lg cursor-pointer"
                  title="View full image"
                  aria-label="View full image"
                >
                  <ExternalLink size={20} />
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="mt-20 pt-10 border-t border-line flex justify-center">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-line bg-surface/50 text-foreground hover:border-accent hover:text-accent hover:bg-surface/80 transition-all duration-300 group cursor-pointer"
          >
            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-eyebrow font-medium uppercase tracking-[0.2em]">
              {t.projects.detail.back}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

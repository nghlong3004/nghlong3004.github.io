import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useLanguage } from "../hooks/useLanguage";
import { Eyebrow } from "./Eyebrow";
import { RevealText } from "./RevealText";
import { TechIcon } from "./TechIcon";

function CompanyLogo({
  logo,
  logoDark,
  company,
  initials,
  className = "size-14 rounded-2xl",
}: {
  logo?: string;
  logoDark?: string;
  company: string;
  initials: string;
  className?: string;
}) {
  if (logo) {
    return (
      <div
        className={`${className} border border-line-strong overflow-hidden flex items-center justify-center p-2.5 shrink-0 bg-surface/30`}
      >
        {logoDark ? (
          <>
            <img
              src={logo}
              alt={company}
              className="w-full h-full object-contain light-only"
              loading="lazy"
            />
            <img
              src={logoDark}
              alt={company}
              className="w-full h-full object-contain dark-only"
              loading="lazy"
            />
          </>
        ) : (
          <img
            src={logo}
            alt={company}
            className="w-full h-full object-contain"
            loading="lazy"
          />
        )}
      </div>
    );
  }

  return (
    <span
      className={`grid place-items-center ${className} border border-line-strong font-semibold text-eyebrow tracking-tight text-foreground shrink-0 bg-surface/30`}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function Experience() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref: sectionRef, inView } = useInView<HTMLElement>();
  const { t, language } = useLanguage();

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="py-section px-gutter"
      aria-label="Work Experience"
    >
      {/* Header */}
      <div>
        <Eyebrow label={t.experience.eyebrow} />
        <RevealText
          key={`exp-heading-${language}`}
          as="h2"
          text={t.experience.heading}
          mode="lines"
          triggered={inView}
          className="mt-6 max-w-[14ch] font-display uppercase leading-[0.95] tracking-[-0.01em] text-h2 sm:text-h1 text-foreground"
        />
      </div>

      {/* Experience list */}
      <ol className="mt-16 flex flex-col">
        {t.experience.roles.map((item, idx) => {
          const delay = idx * 120;

          return (
            <li
              key={`${item.company}-${item.role}`}
              className="border-t border-line py-10 last:border-b"
              style={{
                opacity: reducedMotion || inView ? 1 : 0,
                transform:
                  reducedMotion || inView
                    ? "translateY(0)"
                    : "translateY(24px)",
                transition: reducedMotion
                  ? "none"
                  : `opacity 560ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 560ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
              }}
            >
              {/* Mobile Header: Logo beside Title + Timeline with clean gap */}
              <div className="flex items-start gap-4 sm:gap-5 lg:hidden">
                <CompanyLogo
                  logo={item.logo}
                  logoDark={item.logoDark}
                  company={item.company}
                  initials={item.initials}
                  className="size-14 sm:size-15 rounded-2xl shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-sans text-h3 font-semibold tracking-[-0.01em] text-foreground">
                    {item.role}
                  </h3>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-sans text-body font-medium text-foreground">
                      {item.period}
                    </span>
                    {item.current && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                        <span
                          className="size-1.5 rounded-full bg-accent shrink-0 animate-pulse"
                          aria-hidden="true"
                        />
                        <span>{t.experience.currentLabel}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Desktop Layout: 2-column grid with tighter gap */}
              <div className="mt-0 lg:mt-0 grid grid-cols-1 lg:grid-cols-[10rem_1fr] gap-6 lg:gap-8">
                {/* Left cell (Desktop only): Centered Logo + Centered Timeline */}
                <div className="hidden lg:flex flex-col items-center text-center gap-3.5 shrink-0">
                  <CompanyLogo
                    logo={item.logo}
                    logoDark={item.logoDark}
                    company={item.company}
                    initials={item.initials}
                    className="size-15 sm:size-16 rounded-2xl mx-auto"
                  />
                  <div className="flex flex-col items-center">
                    <p className="font-sans text-body font-medium text-foreground whitespace-nowrap">
                      {item.period}
                    </p>
                    {item.current && (
                      <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-accent whitespace-nowrap">
                        <span
                          className="size-1.5 rounded-full bg-accent shrink-0 animate-pulse"
                          aria-hidden="true"
                        />
                        <span className="whitespace-nowrap">
                          {t.experience.currentLabel}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right cell: Desktop Title + Highlights + Tech Pills */}
                <div>
                  <h3 className="hidden lg:block font-sans text-h3 font-semibold tracking-[-0.01em] text-foreground">
                    {item.role}
                  </h3>

                  {/* Highlights */}
                  <ul className="mt-4 list-disc pl-5 text-body text-muted space-y-1.5">
                    {item.highlights.map((bullet, bIdx) => (
                      <li key={bIdx}>{bullet}</li>
                    ))}
                  </ul>

                  {/* Tech Pills with matching tech icons and normal title casing */}
                  <div className="mt-6 flex flex-wrap gap-2">
                    {item.tech.map((tag) => (
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
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

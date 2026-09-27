import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useLanguage } from "../hooks/useLanguage";
import { Eyebrow } from "./Eyebrow";
import { RevealText } from "./RevealText";

export function Impact() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref: sectionRef, inView } = useInView<HTMLElement>();
  const { t, language } = useLanguage();

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="py-section px-gutter"
      aria-label="Impact and statistics"
    >
      {/* Header */}
      <div>
        <Eyebrow label={t.impact.eyebrow} />
        <RevealText
          key={`impact-heading-${language}`}
          as="h2"
          text={t.impact.heading}
          mode="lines"
          triggered={inView}
          className="mt-6 max-w-[14ch] font-display uppercase leading-none tracking-[-0.01em] text-h2 text-foreground"
        />
      </div>

      {/* Stats list */}
      <dl className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-line">
        {t.impact.stats.map((stat, idx: number) => {
          const delay = idx * 110;
          const isSecondInTwoCol = idx % 2 === 1;
          const isNotFirstInFourCol = idx % 4 !== 0;

          return (
            <div
              key={`${stat.value}-${idx}`}
              className={`flex flex-col justify-between gap-4 border-b border-line px-5 sm:px-6 lg:px-7 xl:px-8 py-8 lg:py-10 group cursor-default ${
                isSecondInTwoCol
                  ? "sm:border-l sm:border-line"
                  : "sm:border-l-0"
              } ${
                isNotFirstInFourCol
                  ? "lg:border-l lg:border-line"
                  : "lg:border-l-0"
              }`}
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
              {/* <dd> first: figure */}
              <dd className="font-display text-4xl sm:text-5xl lg:text-5xl xl:text-6xl leading-none tracking-normal text-foreground transition-colors duration-340 ease-out group-hover:text-primary">
                {stat.value}
              </dd>

              {/* <dt> second: label */}
              <dt className="text-xs sm:text-sm uppercase tracking-[0.12em] text-muted-foreground leading-relaxed">
                {stat.label}
              </dt>
            </div>
          );
        })}
      </dl>
    </section>
  );
}

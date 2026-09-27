import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useLanguage } from "../hooks/useLanguage";
import { Eyebrow } from "./Eyebrow";
import { RevealText } from "./RevealText";

export function Story() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref: sectionRef, inView } = useInView<HTMLElement>();
  const { t, language } = useLanguage();

  return (
    <section
      id="story"
      ref={sectionRef}
      className="py-section px-gutter"
      aria-label="The Story"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter">
        {/* Left Column (lg:col-span-6) */}
        <div className="lg:col-span-6">
          <Eyebrow label={t.story.eyebrow} />
          <RevealText
            key={`story-heading-${language}`}
            as="h2"
            text={t.story.heading}
            mode="lines"
            triggered={inView}
            className="mt-6 max-w-[16ch] font-display uppercase leading-[0.95] tracking-[-0.01em] text-h2 sm:text-h1 text-foreground"
          />
          <p
            className="mt-8 max-w-[46ch] text-lead text-muted"
            style={{
              opacity: reducedMotion || inView ? 1 : 0,
              transform:
                reducedMotion || inView ? "translateY(0)" : "translateY(20px)",
              transition: reducedMotion
                ? "none"
                : "opacity 520ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 520ms cubic-bezier(0.16, 1, 0.3, 1) 200ms",
            }}
          >
            {t.story.intro}
          </p>
        </div>

        {/* Right Column (lg:col-span-6 lg:pt-2) */}
        <div className="lg:col-span-6 lg:pt-2">
          <ul className="flex flex-col">
            {t.story.principles.map((item, idx) => {
              const delay = idx * 90;
              return (
                <li
                  key={item.index}
                  className="grid grid-cols-[auto_1fr] gap-x-6 border-t border-line py-8 last:border-b"
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
                  {/* Left cell: index number */}
                  <span className="font-sans text-h3 font-semibold tabular-nums text-accent leading-none">
                    {item.index}
                  </span>

                  {/* Right cell: title + body */}
                  <div>
                    <h3 className="font-sans text-h3 font-semibold tracking-[-0.01em] text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 max-w-[44ch] text-body text-muted">
                      {item.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

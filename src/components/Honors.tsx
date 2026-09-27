import { useState } from "react";
import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useLanguage } from "../hooks/useLanguage";
import { Eyebrow } from "./Eyebrow";
import { RevealText } from "./RevealText";

export function Honors() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref: sectionRef, inView } = useInView<HTMLElement>();
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const activeHonor = t.honors.items[activeIndex] || t.honors.items[0];

  return (
    <section
      id="honors"
      ref={sectionRef}
      className="py-section px-gutter"
      aria-label="Honors and Awards"
    >
      {/* Header */}
      <div>
        <Eyebrow label={t.honors.eyebrow} />
        <RevealText
          key={`honors-heading-${language}`}
          as="h2"
          text={t.honors.heading}
          mode="lines"
          triggered={inView}
          className="mt-6 max-w-[16ch] font-display uppercase leading-none tracking-[-0.01em] text-h2 text-foreground"
        />
      </div>

      {/* Body Grid */}
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-gutter items-start">
        {/* Selector list (lg:col-span-5) */}
        <ul className="lg:col-span-5 flex flex-col">
          {t.honors.items.map((item, idx: number) => {
            const isActive = idx === activeIndex;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onFocus={() => setActiveIndex(idx)}
                  className="w-full flex items-baseline justify-between gap-5 border-t border-line py-7 text-left group focus:outline-none cursor-pointer last:border-b"
                  aria-pressed={isActive}
                >
                  <div className="flex items-baseline gap-5">
                    {/* Index */}
                    <span
                      className={`text-eyebrow tabular-nums tracking-[0.18em] transition-colors duration-200 ${
                        isActive
                          ? "text-accent"
                          : "text-muted group-hover:text-foreground"
                      }`}
                    >
                      {item.index}
                    </span>

                    {/* Name + Role */}
                    <div>
                      <span
                        className={`block font-sans text-h3 font-semibold tracking-[-0.01em] transition-colors duration-200 ${
                          isActive
                            ? "text-foreground"
                            : "text-muted group-hover:text-foreground"
                        }`}
                      >
                        {item.name}
                      </span>
                      <span className="mt-1 block text-eyebrow uppercase tracking-[0.18em] text-muted">
                        {item.role}
                      </span>
                    </div>
                  </div>

                  {/* Trailing accent line */}
                  <span
                    className={`h-px bg-accent block shrink-0 transition-all duration-300 ease-out ${
                      isActive ? "w-10" : "w-0"
                    }`}
                    aria-hidden="true"
                  />
                </button>
              </li>
            );
          })}
        </ul>

        {/* Featured panel (lg:col-span-7) */}
        <div
          className="lg:col-span-7 flex flex-col justify-between rounded-lg border border-line bg-card/40 p-8 sm:p-10 lg:p-12 relative overflow-hidden"
          style={{
            opacity: reducedMotion || inView ? 1 : 0,
            transform:
              reducedMotion || inView ? "translateY(0)" : "translateY(16px)",
            transition: reducedMotion
              ? "none"
              : "opacity 500ms ease, transform 500ms ease",
          }}
        >
          {/* Decorative watermark index */}
          <span
            className="absolute right-6 -bottom-6 font-display text-[9rem] leading-none text-muted-foreground/5 select-none pointer-events-none"
            aria-hidden="true"
          >
            {activeHonor.index}
          </span>

          <div className="relative z-10">
            <span className="text-eyebrow uppercase tracking-[0.2em] text-primary font-mono mb-4 block">
              {activeHonor.role}
            </span>
            <RevealText
              key={`${activeHonor.id}-${language}`}
              text={activeHonor.text}
              mode="words"
              stagger={22}
              duration={520}
              easing="cubic-bezier(0.165, 0.84, 0.44, 1)"
              yOffset="18px"
              className="max-w-[38ch] font-sans text-h3 font-medium leading-[1.4] tracking-[-0.01em] text-foreground"
            />
          </div>

          <footer className="relative z-10 mt-10 pt-6 border-t border-line/60 flex items-center justify-between text-eyebrow uppercase tracking-[0.18em] text-muted">
            <span className="font-semibold text-foreground">{activeHonor.name}</span>
            <span>{activeHonor.role}</span>
          </footer>
        </div>
      </div>
    </section>
  );
}

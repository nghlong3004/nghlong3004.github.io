import { useLanguage } from "../hooks/useLanguage";
import { RevealText } from "./RevealText";

export function Hero() {
  const { t, language } = useLanguage();

  return (
    <section
      id="top"
      className="relative flex flex-col justify-between min-h-[100svh] overflow-hidden"
      aria-label="Introduction"
    >

      {/* Centered role words */}
      <div className="relative z-30 flex flex-col items-center justify-center text-center pt-24 sm:pt-32 px-gutter pointer-events-none">
        <RevealText
          key={language}
          as="h2"
          text={t.hero.roles}
          mode="lines"
          delay={2700}
          stagger={80}
          duration={760}
          className="font-display uppercase leading-[1.08] tracking-[-0.01em] text-foreground text-[1.35rem] sm:text-h2 text-center"
        />
      </div>

      {/* Giant username h1 centered */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center pb-12 sm:pb-24 select-none px-gutter my-auto">
        <h1
          className="font-display uppercase leading-[0.82] tracking-[-0.01em] text-accent text-[clamp(2.5rem,10vw,13rem)] text-center whitespace-nowrap transition-transform duration-500 hover:scale-[1.02] cursor-default"
          aria-label="nghlong3004"
        >
          <span className="block whitespace-nowrap overflow-hidden">
            <RevealText
              text="nghlong3004"
              mode="letters"
              delay={2500}
              stagger={52}
              duration={900}
              className="block whitespace-nowrap"
            />
          </span>
        </h1>
      </div>
    </section>
  );
}

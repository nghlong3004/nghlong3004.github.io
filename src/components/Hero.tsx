import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useLanguage } from "../hooks/useLanguage";
import CircularText from "./CircularText";
import TypewriterTitle from "./kokonutui/type-writer";
import "./Hero.css";

const HERO_ROLE_SEQUENCES = [
  { text: "DEVELOPER", deleteAfter: true, pauseAfter: 2200 },
  { text: "BACKEND", deleteAfter: true, pauseAfter: 2200 },
  { text: "AUTOMATION", deleteAfter: true, pauseAfter: 2200 },
  { text: "BUILDER", deleteAfter: true, pauseAfter: 2200 },
];

export function Hero() {
  const { t } = useLanguage();
  const reducedMotion = useReducedMotion();

  return (
    <section id="top" className="hero" aria-labelledby="hero-name">
      {/* Cột trái: Gom toàn bộ thông tin Typography & CTA (Phương án 3) */}
      <div className="hero__content">
        <div className="hero__intro">
          <h1 id="hero-name" className="hero__name">
            {t.hero.headline}
          </h1>

          <div className="hero__role-row">
            <div className="hero__role">
              {reducedMotion ? (
                <p className="hero__static-role">{HERO_ROLE_SEQUENCES[0].text}</p>
              ) : (
                <TypewriterTitle
                  as="p"
                  sequences={HERO_ROLE_SEQUENCES}
                  startDelay={400}
                  typingSpeed={70}
                  deleteMode="select"
                  typos={false}
                  className="hero__typewriter"
                  textClassName="hero__typed-role"
                />
              )}
            </div>
          </div>
        </div>

        <div className="hero__details">
          <p className="hero__description">{t.hero.subheadline}</p>

          <div className="hero__links">
            <a className="hero__work" href="#projects">
              <span>{t.hero.ctaWork}</span>
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            <a className="hero__contact" href="#contact">
              <span>{t.hero.ctaContact}</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Cột phải: Vòng tròn tâm điểm lớn bề thế */}
      <div className="hero__visual">
        <div className="hero__seal">
          <CircularText
            text={`SOFTWARE ENGINEERING • DEVELOPER • ${t.hero.headline.toUpperCase()} • `}
            spinDuration={reducedMotion ? 0 : 25}
            onHover="speedUp"
            draggable={true}
            hoverTilt={30}
            size={240}
            fontSize={13}
            fontWeight={700}
            className="hero__ring"
          >
            <img
              src={`${import.meta.env.BASE_URL}favicon.webp`}
              alt=""
              width="120"
              height="120"
              className="hero__logo"
              draggable={false}
            />
          </CircularText>
        </div>
      </div>
    </section>
  );
}

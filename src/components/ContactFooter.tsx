import { useInView } from "../hooks/useInView";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useLanguage } from "../hooks/useLanguage";
import { SOCIAL_LINKS, type SocialLink } from "../data/socials";
import { Eyebrow } from "./Eyebrow";
import { RevealText } from "./RevealText";

export function ContactFooter() {
  const reducedMotion = usePrefersReducedMotion();
  const { ref: sectionRef, inView } = useInView<HTMLElement>();
  const { t, language } = useLanguage();

  return (
    <footer
      id="contact"
      ref={sectionRef}
      className="pt-section px-gutter"
      aria-label="Contact and Colophon"
    >
      {/* Eyebrow */}
      <Eyebrow label={t.contact.eyebrow} />

      {/* Heading */}
      <RevealText
        key={`contact-heading-${language}`}
        as="h2"
        text={t.contact.heading}
        mode="lines"
        triggered={inView}
        className="mt-6 max-w-[18ch] font-display uppercase leading-[0.95] tracking-[-0.01em] text-h1 sm:text-display text-foreground"
      />

      {/* Body text */}
      <p
        className="mt-8 max-w-[44ch] text-lead text-muted"
        style={{
          opacity: reducedMotion || inView ? 1 : 0,
          transform:
            reducedMotion || inView ? "translateY(0)" : "translateY(20px)",
          transition: reducedMotion
            ? "none"
            : "opacity 520ms cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 520ms cubic-bezier(0.16, 1, 0.3, 1) 200ms",
        }}
      >
        {t.contact.intro}
      </p>

      {/* Email link with spring hover */}
      <div className="mt-12">
        <a
          href="mailto:nghlong3004@gmail.com"
          className="group inline-flex items-baseline gap-3 sm:gap-4 font-sans text-h3 sm:text-h1 font-semibold tracking-[-0.01em] break-all text-foreground transition-all duration-340 ease-out hover:translate-x-[14px] hover:text-accent focus:outline-none"
        >
          <span>nghlong3004@gmail.com</span>
          <span className="text-accent transition-transform duration-340 group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        </a>
      </div>

      {/* Footer bar */}
      <div className="mt-section border-t border-line py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-baseline">
        {/* Left (lg:col-span-6): signature */}
        <div className="lg:col-span-6">
          <p className="font-display text-h2 uppercase leading-none tracking-[-0.01em] text-foreground">
            Nguyen Hoang Long
          </p>
          <p className="mt-4 text-eyebrow uppercase tracking-[0.22em] text-muted">
            {t.contact.footerTagline}
          </p>
        </div>

        {/* Middle (lg:col-span-3): Social links */}
        <nav className="lg:col-span-3" aria-label="Social">
          <ul className="flex flex-col gap-3">
            {SOCIAL_LINKS.map((link: SocialLink) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-2 text-body text-muted hover:text-foreground transition-colors duration-200"
                >
                  <span
                    className="h-px bg-accent block w-0 group-hover:w-6 transition-all duration-300 ease-out"
                    aria-hidden="true"
                  />
                  <span>{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right (lg:col-span-3; lg:text-align:right): Copyright */}
        <div className="lg:col-span-3 lg:text-right">
          <p className="text-eyebrow uppercase tracking-[0.18em] text-muted">
            {t.contact.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

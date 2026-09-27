import { useLanguage } from "../hooks/useLanguage";

export function Marquee() {
  const { t } = useLanguage();
  // Render words array twice for seamless looping
  const trackItems = [...t.marquee, ...t.marquee];

  return (
    <section
      aria-label="Operating principles"
      className="overflow-hidden border-y border-line py-8 select-none"
    >
      <div className="flex w-max flex-nowrap animate-marquee">
        {trackItems.map((word, idx) => (
          <div key={idx} className="flex items-center shrink-0">
            <span className="font-display text-h2 uppercase tracking-[-0.01em] text-foreground">
              {word}
            </span>
            <span
              className="mx-8 size-2.5 rounded-full bg-accent shrink-0"
              aria-hidden="true"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

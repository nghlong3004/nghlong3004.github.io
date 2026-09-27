import { useInView } from "../hooks/useInView";
import { Eyebrow } from "./Eyebrow";
import { RevealText } from "./RevealText";

interface SectionHeadingProps {
  eyebrow: string;
  heading: string | readonly string[];
  maxWidth?: string;
  className?: string;
  headingClassName?: string;
  as?: "h1" | "h2";
}

export function SectionHeading({
  eyebrow,
  heading,
  maxWidth = "max-w-[16ch]",
  className = "",
  headingClassName = "font-display uppercase leading-[0.95] tracking-[-0.01em] text-h2 sm:text-h1 text-foreground",
  as = "h2",
}: SectionHeadingProps) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={className}>
      <Eyebrow label={eyebrow} />
      <RevealText
        as={as}
        text={heading}
        mode="lines"
        triggered={inView}
        className={`mt-6 ${maxWidth} ${headingClassName}`}
      />
    </div>
  );
}

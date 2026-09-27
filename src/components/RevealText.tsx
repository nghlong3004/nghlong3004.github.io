import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

interface RevealTextProps {
  text: string | readonly string[];
  mode?: "letters" | "words" | "lines";
  triggered?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  easing?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  yOffset?: string;
}

export function RevealText({
  text,
  mode = "lines",
  triggered = true,
  delay = 0,
  stagger,
  duration,
  easing,
  className = "",
  as: Component = "span",
  yOffset,
}: RevealTextProps) {
  const reducedMotion = usePrefersReducedMotion();

  const computedDuration =
    duration ??
    (mode === "letters" ? 900 : mode === "words" ? 520 : 850);
  const computedStagger =
    stagger ??
    (mode === "letters" ? 52 : mode === "words" ? 22 : 90);
  const computedEasing =
    easing ??
    (mode === "words"
      ? "cubic-bezier(0.165, 0.84, 0.44, 1)"
      : "cubic-bezier(0.16, 1, 0.3, 1)");
  const computedYOffset =
    yOffset ??
    (mode === "letters" ? "100%" : mode === "words" ? "18px" : "110%");

  // Extract items based on mode
  let items: string[] = [];

  if (Array.isArray(text)) {
    if (mode === "letters") {
      items = text.join(" ").split("");
    } else if (mode === "words") {
      items = text.join(" ").split(/\s+/).filter(Boolean);
    } else {
      items = [...text];
    }
  } else if (typeof text === "string") {
    if (mode === "letters") {
      items = text.split("");
    } else if (mode === "words") {
      items = text.split(/\s+/).filter(Boolean);
    } else {
      // If mode is lines and string has newlines, split by \n.
      // Otherwise split by sentence or treat as single block line.
      items = text.includes("\n") ? text.split("\n") : [text];
    }
  }

  return (
    <Component className={className}>
      {items.map((item, idx) => {
        const itemDelay = delay + idx * computedStagger;
        const isSpace = item === " ";

        if (mode === "letters") {
          return (
            <span
              key={idx}
              className="inline-block overflow-hidden align-top"
              aria-hidden="true"
            >
              <span
                style={{
                  display: "inline-block",
                  transform:
                    reducedMotion || triggered
                      ? "translateY(0)"
                      : `translateY(${computedYOffset})`,
                  opacity: reducedMotion || triggered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `transform ${computedDuration}ms ${computedEasing} ${itemDelay}ms, opacity ${computedDuration}ms ${computedEasing} ${itemDelay}ms`,
                  whiteSpace: isSpace ? "pre" : "normal",
                }}
              >
                {isSpace ? "\u00A0" : item}
              </span>
            </span>
          );
        }

        if (mode === "words") {
          return (
            <span
              key={idx}
              className="inline-block overflow-hidden align-top mr-[0.28em] last:mr-0"
            >
              <span
                style={{
                  display: "inline-block",
                  transform:
                    reducedMotion || triggered
                      ? "translateY(0)"
                      : `translateY(${computedYOffset})`,
                  opacity: reducedMotion || triggered ? 1 : 0,
                  transition: reducedMotion
                    ? "none"
                    : `transform ${computedDuration}ms ${computedEasing} ${itemDelay}ms, opacity ${computedDuration}ms ${computedEasing} ${itemDelay}ms`,
                }}
              >
                {item}
              </span>
            </span>
          );
        }

        // lines
        return (
          <span
            key={idx}
            className="block overflow-hidden leading-[inherit]"
          >
            <span
              style={{
                display: "block",
                transform:
                  reducedMotion || triggered
                    ? "translateY(0)"
                    : `translateY(${computedYOffset})`,
                opacity: reducedMotion || triggered ? 1 : 0,
                transition: reducedMotion
                  ? "none"
                  : `transform ${computedDuration}ms ${computedEasing} ${itemDelay}ms, opacity ${computedDuration}ms ${computedEasing} ${itemDelay}ms`,
              }}
            >
              {item}
            </span>
          </span>
        );
      })}
    </Component>
  );
}

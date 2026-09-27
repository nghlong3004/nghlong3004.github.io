import { useEffect, useRef, useState, type RefObject } from "react";

export function useInView<T extends HTMLElement = HTMLElement>(
  externalRef?: RefObject<T | null>,
  options?: IntersectionObserverInit
) {
  const internalRef = useRef<T | null>(null);
  const targetRef = externalRef || internalRef;
  const [inView, setInView] = useState(() => {
    return typeof window !== "undefined" && typeof IntersectionObserver === "undefined";
  });

  useEffect(() => {
    const el = targetRef.current;
    if (!el || inView) return;

    if (typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
          observer.disconnect();
        }
      },
      {
        threshold: 0,
        rootMargin: "0px",
        ...options,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, inView, options]);

  return { ref: targetRef, inView };
}

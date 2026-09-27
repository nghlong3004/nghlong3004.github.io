import { useEffect, useRef } from "react";

export function ScrollProgressIndicator() {
  const scrollBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollBarRef.current) {
        const { scrollHeight, clientHeight } = document.documentElement;
        const scrollableHeight = scrollHeight - clientHeight;
        const scrollY = window.scrollY;
        const scrollProgress =
          scrollableHeight > 0
            ? Math.min(Math.max((scrollY / scrollableHeight) * 100, 0), 100)
            : 0;

        scrollBarRef.current.style.transform = `translateY(-${100 - scrollProgress
          }%)`;
      }
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-[50svh] right-[2%] -translate-y-1/2 w-1.5 h-[100px] rounded-full bg-background-light border border-line-strong/30 overflow-hidden z-40 pointer-events-none select-none shadow-sm"
      aria-hidden="true"
    >
      <div
        className="w-full bg-primary rounded-full h-full will-change-transform"
        ref={scrollBarRef}
      />
    </div>
  );
}

export default ScrollProgressIndicator;

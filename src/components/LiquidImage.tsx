import { useEffect, useId, useRef, useState } from "react";

interface LiquidImageProps {
  src?: string;
  videoSrc?: string;
  poster?: string;
  alt?: string;
  bare?: boolean;
  maxScale?: number;
  className?: string;
  aspectRatio?: string;
  objectFit?: "cover" | "contain";
  objectPosition?: string;
  placeholderLabel?: string;
}

export function LiquidImage({
  src,
  videoSrc,
  poster,
  alt = "",
  bare = false,
  maxScale = 28,
  className = "",
  aspectRatio,
  objectFit = "cover",
  objectPosition = "center",
  placeholderLabel,
}: LiquidImageProps) {
  const rawId = useId();
  const filterId = `liquid-filter-${rawId.replace(/[^a-zA-Z0-9-_]/g, "")}`;

  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const turbRef = useRef<SVGFETurbulenceElement | null>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Imperative spring state for liquid distortion (tension: 140, friction: 13)
  useEffect(() => {
    // Disable hover effects on touch or small devices
    if (typeof window === "undefined") return;

    let animId: number;
    let currentProgress = isHovered ? 0 : 1;
    let velocity = 0;
    const targetProgress = isHovered ? 1 : 0;
    const tension = 140;
    const friction = 13;
    let lastTime = performance.now();

    function step(now: number) {
      const dt = Math.min((now - lastTime) / 1000, 0.033);
      lastTime = now;

      const displacement = currentProgress - targetProgress;
      const springForce = -tension * displacement;
      const dampingForce = -friction * velocity;
      const acceleration = springForce + dampingForce;

      velocity += acceleration * dt;
      currentProgress += velocity * dt;

      const scale = 1 + currentProgress * (maxScale - 1);
      const baseFreq = 0.009 + currentProgress * (0.022 - 0.009);

      if (dispRef.current) {
        dispRef.current.setAttribute("scale", scale.toFixed(2));
      }
      if (turbRef.current) {
        turbRef.current.setAttribute("baseFrequency", baseFreq.toFixed(5));
      }

      const isResting =
        Math.abs(currentProgress - targetProgress) < 0.001 &&
        Math.abs(velocity) < 0.001;

      if (!isResting) {
        animId = requestAnimationFrame(step);
      } else {
        currentProgress = targetProgress;
        const finalScale = 1 + targetProgress * (maxScale - 1);
        const finalBaseFreq = 0.009 + targetProgress * (0.022 - 0.009);
        if (dispRef.current) {
          dispRef.current.setAttribute("scale", finalScale.toFixed(2));
        }
        if (turbRef.current) {
          turbRef.current.setAttribute(
            "baseFrequency",
            finalBaseFreq.toFixed(5)
          );
        }
      }
    }

    animId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animId);
  }, [isHovered, maxScale]);

  const handleMouseEnter = () => {
    if (window.innerWidth > 768) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <figure
      role="img"
      aria-label={alt || placeholderLabel}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={aspectRatio ? { aspectRatio } : undefined}
      className={`relative overflow-hidden ${
        bare ? "" : "bg-surface"
      } ${className}`}
    >
      {/* Hidden SVG Filter definition */}
      <svg
        className="absolute w-0 h-0 pointer-events-none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0.009"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="1"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Media: Video or Image */}
      {videoSrc ? (
        <video
          src={videoSrc}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          style={{
            filter: `url(#${filterId})`,
            objectFit,
            objectPosition,
          }}
          className="absolute inset-0 w-full h-full block"
        />
      ) : src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          style={{
            filter: `url(#${filterId})`,
            objectFit,
            objectPosition,
          }}
          className="absolute inset-0 w-full h-full block transition-transform duration-700 ease-out"
        />
      ) : (
        /* Branded radial placeholder */
        <div
          className="absolute inset-0 flex items-center justify-center p-6 text-center"
          style={{
            background:
              "radial-gradient(130% 130% at 30% 15%, var(--surface-2), var(--background))",
          }}
        >
          {placeholderLabel && (
            <span className="font-display uppercase text-h3 text-muted tracking-tight">
              {placeholderLabel}
            </span>
          )}
        </div>
      )}

      {/* Non-bare Overlays */}
      {!bare && (
        <>
          {/* Subtle accent glow sweep on hover */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out"
            style={{
              background:
                "linear-gradient(120deg, transparent 35%, color-mix(in srgb, var(--accent) 15%, transparent) 50%, transparent 65%)",
              opacity: isHovered ? 1 : 0,
            }}
          />
        </>
      )}
    </figure>
  );
}

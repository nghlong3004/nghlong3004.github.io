"use client";

/**
 * @author: @dorianbaffier
 * @description: Particle Button
 * @version: 1.1.0
 * @date: 2025-06-26
 * @license: MIT
 * @website: https://kokonutui.com
 * @github: https://github.com/kokonut-labs/kokonutui
 */

import { MousePointerClick } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import {
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// `asChild` is left out: Slot needs a single child, and the button renders
// the particle layer, the label and the icon.
export interface ParticleButtonProps
  extends Omit<ComponentProps<typeof Button>, "asChild"> {
  /** Called after a click that was not `preventDefault()`-ed, alongside the burst. */
  onSuccess?: () => void;
  /** How long (ms) the particle layer stays mounted after a click. */
  successDuration?: number;
  /** Icon rendered after the label. Pass `null` to hide it. */
  icon?: ReactNode;
}

interface Particle {
  x: number;
  y: number;
}

interface Burst {
  id: number;
  particles: Particle[];
}

const PARTICLE_COUNT = 8;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function createParticles(): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const angle = (i / PARTICLE_COUNT) * Math.PI * 2 + (Math.random() * 0.4 - 0.2);
    const distance = Math.random() * 36 + 20;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
    };
  });
}

function SuccessParticles({ particles }: { particles: Particle[] }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-visible"
    >
      {particles.map((particle, i) => (
        <motion.span
          animate={{
            opacity: [1, 1, 0],
            scale: [0.4, 1.2, 0.3],
            x: particle.x,
            y: particle.y,
          }}
          className="absolute top-1/2 left-1/2 -mt-1 -ml-1 size-1.5 rounded-full bg-accent pointer-events-none shadow-[0_0_8px_var(--color-accent)]"
          initial={{ opacity: 0, scale: 0.4, x: 0, y: 0 }}
          // biome-ignore lint/suspicious/noArrayIndexKey: particles are a fixed-size, never-reordered list
          key={i}
          transition={{
            duration: 0.5,
            delay: i * 0.015,
            ease: EASE_OUT,
          }}
        />
      ))}
    </span>
  );
}

export default function ParticleButton({
  children,
  onClick,
  onSuccess,
  successDuration = 600,
  icon = <MousePointerClick className="h-4 w-4" />,
  className,
  ...props
}: ParticleButtonProps) {
  const [burst, setBurst] = useState<Burst | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstIdRef = useRef(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    []
  );

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (!shouldReduceMotion) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      burstIdRef.current += 1;
      // A new id remounts the particles so rapid re-clicks restart the burst.
      setBurst({ id: burstIdRef.current, particles: createParticles() });
      timeoutRef.current = setTimeout(() => {
        setBurst(null);
        timeoutRef.current = null;
      }, successDuration);
    }

    onClick?.(e);
    onSuccess?.();
  };

  // The particle layer sits inside the Button (absolute, so it skips the flex
  // gap) so `className` lands on the root and the burst paints above the face.
  return (
    <Button
      className={cn(
        "relative transition-[scale,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:transition-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {burst && <SuccessParticles key={burst.id} particles={burst.particles} />}
      {children}
      {icon}
    </Button>
  );
}

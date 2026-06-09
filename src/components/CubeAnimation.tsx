import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CubeAnimation = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const outerRef = useRef<SVGPathElement>(null);
    const inner1Ref = useRef<SVGPathElement>(null);
    const inner2Ref = useRef<SVGPathElement>(null);
    const inner3Ref = useRef<SVGPathElement>(null);

    useGSAP(() => {
        // Calculate total path lengths for drawing animation
        const outerLen = outerRef.current?.getTotalLength() || 0;
        const inner1Len = inner1Ref.current?.getTotalLength() || 0;
        const inner2Len = inner2Ref.current?.getTotalLength() || 0;
        const inner3Len = inner3Ref.current?.getTotalLength() || 0;

        // Reset paths to hidden states
        gsap.set(outerRef.current, { strokeDasharray: outerLen, strokeDashoffset: outerLen });
        gsap.set(inner1Ref.current, { strokeDasharray: inner1Len, strokeDashoffset: inner1Len });
        gsap.set(inner2Ref.current, { strokeDasharray: inner2Len, strokeDashoffset: inner2Len });
        gsap.set(inner3Ref.current, { strokeDasharray: inner3Len, strokeDashoffset: inner3Len });

        gsap.set('.svg-face', { opacity: 0 });
        gsap.set(svgRef.current, { autoAlpha: 0 });
        // Set initial state for roll-in animation (starts scale 0, pre-colored with primary color)
        gsap.set(svgRef.current, { scale: 0, rotation: -180, transformOrigin: '50% 50%' });
        gsap.set([outerRef.current, inner1Ref.current, inner2Ref.current, inner3Ref.current], {
            stroke: 'var(--color-primary)',
            strokeWidth: 2,
        });
        gsap.set('.svg-face', {
            fill: 'var(--color-primary)',
            opacity: 0,
        });

        // 1. Entrance animation (runs once on load: roll-in + wireframe draw + hover-like flash -> settle)
        const entranceTl = gsap.timeline();
        entranceTl.to(svgRef.current, { autoAlpha: 1, duration: 0.2 });

        // Roll in and scale up to 1.12 (the hover scale)
        entranceTl.to(svgRef.current, {
            scale: 1.12,
            rotation: 0,
            duration: 1.8,
            ease: 'back.out(1.25)',
        }, 0);

        // Draw the wireframe lines
        entranceTl.to([outerRef.current, inner1Ref.current, inner2Ref.current, inner3Ref.current], {
            strokeDashoffset: 0,
            duration: 1.5,
            stagger: 0.1,
            ease: 'power2.inOut',
        }, 0);

        // Fade in highlighted faces
        entranceTl.to('.svg-face', {
            opacity: 0.12,
            duration: 0.7,
            stagger: 0.06,
            ease: 'power2.out',
        }, '-=0.6');

        // Settle down: fade back to default subtle state (just like leaving hover)
        entranceTl.to(svgRef.current, {
            scale: 1,
            duration: 0.8,
            ease: 'power2.out',
        });

        entranceTl.to([outerRef.current, inner1Ref.current, inner2Ref.current, inner3Ref.current], {
            clearProps: 'stroke,strokeWidth',
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.8');

        entranceTl.to('.svg-face', {
            clearProps: 'fill,opacity',
            duration: 0.8,
            ease: 'power2.out',
        }, '-=0.8');

        // 2. Gentle floating hover effect (looping, starts after entrance)
        entranceTl.add(() => {
            gsap.to(svgRef.current, {
                y: '+=8',
                duration: 2.2,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
            });
        });

        // 3. Hover & Click Interactions (Mouse Enter / Mouse Leave / Click)
        const svgEl = svgRef.current;
        let hoverTimeline: gsap.core.Timeline | null = null;

        const onMouseEnter = () => {
            // Kill any active leave animation
            hoverTimeline = gsap.timeline();

            // Hover: Scale up slightly and spin faster
            hoverTimeline.to(svgEl, {
                scale: 1.12,
                rotation: '+=120',
                duration: 0.8,
                ease: 'power2.out',
                overwrite: 'auto',
            }, 0);

            // Highlight lines to primary Indigo and thicken them
            hoverTimeline.to([outerRef.current, inner1Ref.current, inner2Ref.current, inner3Ref.current], {
                stroke: 'var(--color-primary)',
                strokeWidth: 2,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: 'auto',
            }, 0);

            // Highlight faces
            hoverTimeline.to('.svg-face', {
                fill: 'var(--color-primary)',
                opacity: 0.12,
                duration: 0.4,
                ease: 'power2.out',
                overwrite: 'auto',
            }, 0);
        };

        const onMouseLeave = () => {
            if (hoverTimeline) hoverTimeline.kill();

            const leaveTl = gsap.timeline();
            // Restore scale and reset rotation to 0
            leaveTl.to(svgEl, {
                scale: 1,
                rotation: 0,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: 'auto',
            }, 0);

            // Reset lines (clear inline properties to let Tailwind classes take over)
            leaveTl.to([outerRef.current, inner1Ref.current, inner2Ref.current, inner3Ref.current], {
                clearProps: 'stroke,strokeWidth',
                duration: 0.6,
                ease: 'power2.out',
            }, 0);

            // Reset faces (clear inline fill/opacity to let CSS variables take over)
            leaveTl.to('.svg-face', {
                clearProps: 'fill,opacity',
                duration: 0.6,
                ease: 'power2.out',
            }, 0);
        };

        svgEl?.addEventListener('mouseenter', onMouseEnter);
        svgEl?.addEventListener('mouseleave', onMouseLeave);

        // 4. ScrollTrigger scrub animation (disintegration as user scrolls down)
        const scrollTl = gsap.timeline({
            scrollTrigger: {
                trigger: svgRef.current?.closest('#banner') || '#banner',
                start: 'top top',
                end: 'bottom 20%',
                scrub: 1,
            },
        });

        // Glitch effect: Convert lines to dashed segments on scroll
        scrollTl.to([outerRef.current, inner1Ref.current, inner2Ref.current, inner3Ref.current], {
            strokeDasharray: '6, 14',
            duration: 0.4,
            ease: 'none',
        }, 0);

        // Disintegrate paths in 3D directions using fromTo to prevent starting-state clashing
        scrollTl.fromTo(outerRef.current, {
            scale: 1,
            rotation: 0,
            opacity: 1,
        }, {
            scale: 1.4,
            rotation: 45,
            transformOrigin: '50% 50%',
            opacity: 0,
            ease: 'power1.out',
        }, 0);

        scrollTl.fromTo(inner1Ref.current, {
            y: 0,
            x: 0,
            rotation: 0,
            opacity: 1,
        }, {
            y: -120,
            x: -20,
            rotation: -30,
            transformOrigin: '50% 50%',
            opacity: 0,
            ease: 'power1.out',
        }, 0);

        scrollTl.fromTo(inner2Ref.current, {
            y: 0,
            x: 0,
            rotation: 0,
            opacity: 1,
        }, {
            y: 80,
            x: 100,
            rotation: 40,
            transformOrigin: '50% 50%',
            opacity: 0,
            ease: 'power1.out',
        }, 0);

        scrollTl.fromTo(inner3Ref.current, {
            y: 0,
            x: 0,
            rotation: 0,
            opacity: 1,
        }, {
            y: 80,
            x: -100,
            rotation: -40,
            transformOrigin: '50% 50%',
            opacity: 0,
            ease: 'power1.out',
        }, 0);

        // Disintegrate faces
        scrollTl.fromTo('.svg-face-top', {
            y: 0,
            x: 0,
            scale: 1,
            opacity: 0.12,
        }, {
            y: -80,
            x: 40,
            scale: 0.6,
            opacity: 0,
            ease: 'power1.out',
        }, 0);

        scrollTl.fromTo('.svg-face-left', {
            y: 0,
            x: 0,
            scale: 1,
            opacity: 0.12,
        }, {
            y: 80,
            x: -80,
            scale: 0.6,
            opacity: 0,
            ease: 'power1.out',
        }, 0);

        scrollTl.fromTo('.svg-face-right', {
            y: 0,
            x: 0,
            scale: 1,
            opacity: 0.12,
        }, {
            y: 80,
            x: 80,
            scale: 0.6,
            opacity: 0,
            ease: 'power1.out',
        }, 0);

        // Slowly rotate and fade out the container
        scrollTl.fromTo(svgRef.current, {
            rotation: 0,
        }, {
            rotation: 50,
            transformOrigin: '50% 50%',
            ease: 'power1.out',
        }, 0);

        return () => {
            svgEl?.removeEventListener('mouseenter', onMouseEnter);
            svgEl?.removeEventListener('mouseleave', onMouseLeave);
        };
    }, { scope: svgRef });

    return (
        <div className="absolute bottom-[116px] md:bottom-[230px] left-1/2 md:left-[58%] -translate-x-1/2 z-0 w-[160px] h-[160px] md:w-[240px] md:h-[240px] select-none">
            <svg
                id="banner-cube-svg"
                viewBox="0 0 200 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
                ref={svgRef}
            >


                {/* Faces */}
                <path
                    d="M 30.72 60 L 100 20 L 169.28 60 L 100 100 Z"
                    fill="currentColor"
                    className="svg-face svg-face-top text-foreground/[0.015] dark:text-white/[0.01]"
                />
                <path
                    d="M 100 100 L 30.72 60 L 30.72 140 L 100 180 Z"
                    fill="currentColor"
                    className="svg-face svg-face-left text-foreground/[0.025] dark:text-white/[0.02]"
                />
                <path
                    d="M 100 100 L 169.28 60 L 169.28 140 L 100 180 Z"
                    fill="currentColor"
                    className="svg-face svg-face-right text-foreground/[0.035] dark:text-white/[0.03]"
                />

                {/* Wireframe Outline */}
                <path
                    className="text-foreground/15 dark:text-muted-foreground/25"
                    d="M 100 20 L 169.28 60 L 169.28 140 L 100 180 L 30.72 140 L 30.72 60 Z"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    ref={outerRef}
                />

                {/* Inner Y-axes */}
                <path
                    className="text-foreground/15 dark:text-muted-foreground/25"
                    d="M 100 100 L 100 20"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    ref={inner1Ref}
                />
                <path
                    className="text-foreground/15 dark:text-muted-foreground/25"
                    d="M 100 100 L 169.28 140"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    ref={inner2Ref}
                />
                <path
                    className="text-foreground/15 dark:text-muted-foreground/25"
                    d="M 100 100 L 30.72 140"
                    stroke="currentColor"
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    ref={inner3Ref}
                />


            </svg>
        </div>
    );
};

export default CubeAnimation;

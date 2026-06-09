import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

interface PreloaderProps {
    onComplete?: () => void;
}

const Preloader = ({ onComplete }: PreloaderProps) => {
    const preloaderRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const tl = gsap.timeline({
                defaults: {
                    ease: 'power2.inOut',
                },
            });

            // 1. Letters slide up into view (stagger)
            tl.to('.name-text span', {
                y: 0,
                stagger: 0.04,
                duration: 0.4,
            });

            // 2. Pause to let user read
            tl.to({}, { duration: 0.6 });

            // 3. Letters slide up and out (stagger from center)
            tl.to('.name-text span', {
                y: '-120%',
                opacity: 0,
                stagger: {
                    each: 0.03,
                    from: 'center',
                },
                duration: 0.3,
                ease: 'power3.in',
            });

            // 4. Blinds slide up sequentially left → right (waterfall)
            tl.to('.preloader-item', {
                y: '-100%',
                duration: 0.5,
                stagger: {
                    each: 0.05,
                    from: 'start',
                },
                ease: 'power4.inOut',
            }, '-=0.15');

            // 5. Hide container
            tl.set(preloaderRef.current, {
                autoAlpha: 0,
                pointerEvents: 'none',
                onComplete: () => {
                    onComplete?.();
                },
            });
        },
        { scope: preloaderRef },
    );

    return (
        <div className="fixed inset-0 z-[6] flex" ref={preloaderRef}>
            <div className="preloader-item h-full w-[10%] bg-background"></div>
            <div className="preloader-item h-full w-[10%] bg-background"></div>
            <div className="preloader-item h-full w-[10%] bg-background"></div>
            <div className="preloader-item h-full w-[10%] bg-background"></div>
            <div className="preloader-item h-full w-[10%] bg-background"></div>
            <div className="preloader-item h-full w-[10%] bg-background"></div>
            <div className="preloader-item h-full w-[10%] bg-background"></div>
            <div className="preloader-item h-full w-[10%] bg-background"></div>
            <div className="preloader-item h-full w-[10%] bg-background"></div>
            <div className="preloader-item h-full w-[10%] bg-background"></div>

            <p className="name-text flex text-[12vw] lg:text-[130px] font-anton text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 leading-none overflow-hidden">
                <span className="inline-block translate-y-full">N</span>
                <span className="inline-block translate-y-full">G</span>
                <span className="inline-block translate-y-full">H</span>
                <span className="inline-block translate-y-full">L</span>
                <span className="inline-block translate-y-full">O</span>
                <span className="inline-block translate-y-full">N</span>
                <span className="inline-block translate-y-full">G</span>
                <span className="inline-block translate-y-full">3</span>
                <span className="inline-block translate-y-full">0</span>
                <span className="inline-block translate-y-full">0</span>
                <span className="inline-block translate-y-full">4</span>
            </p>
        </div>
    );
};

export default Preloader;

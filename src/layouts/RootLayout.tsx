import { useState, useEffect } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';
import { ReactLenis } from 'lenis/react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import gsap from 'gsap';

import Preloader from '@/components/Preloader';
import ScrollProgressIndicator from '@/components/ScrollProgressIndicator';
import ParticleBackground from '@/components/ParticleBackground';

const RootLayout = () => {
    const [isPreloaderComplete, setIsPreloaderComplete] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Animate the transition overlay out when path changes
        const tl = gsap.timeline();
        tl.to('.page-transition', {
            yPercent: -100,
            duration: 0.4,
            ease: 'power2.inOut',
        });
        // Reset overlay state so it is positioned at the bottom, ready for next transition
        tl.set('.page-transition', { yPercent: 100 });
        tl.set('.page-transition--inner', { yPercent: 100 });
    }, [location.pathname]);

    return (
        <ThemeProvider>
            <HelmetProvider>
                <ReactLenis
                    root
                    options={{
                        lerp: 0.1,
                        duration: 1.4,
                    }}
                >
                    <Navbar />
                    <main>
                        <Outlet context={{ isPreloaderComplete }} />
                    </main>
                    <Footer />

                    <Preloader onComplete={() => setIsPreloaderComplete(true)} />
                    <ScrollProgressIndicator />
                    <ParticleBackground />

                    {/* Page Transition Overlays */}
                    <div className="page-transition fixed inset-0 z-[99] pointer-events-none transform translate-y-full flex flex-col">
                        <div className="page-transition--inner w-full h-full bg-primary" />
                    </div>

                    <ScrollRestoration />
                </ReactLenis>
            </HelmetProvider>
        </ThemeProvider>
    );
};

export default RootLayout;

import CubeAnimation from '@/components/CubeAnimation';
import Button from '@/components/Button';
import { GENERAL_INFO, PROJECTS } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useOutletContext } from 'react-router';

import TypingText from '@/components/TypingText';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const getAge = (birthDateString: string) => {
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const Banner = () => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const { isPreloaderComplete } = useOutletContext<{ isPreloaderComplete: boolean }>();
    const awards = t('education.awards', { returnObjects: true }) as unknown[];
    const awardsCount = awards.length;

    const age = getAge('2005-06-06');
    const cleanedDescription = t('banner.description', { age }).replace(/<\/?\d+>/g, '');
    const currentYear = new Date().getFullYear();
    const codingYears = `${currentYear - 2022}+`;

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(min-width: 768px)', () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'bottom 70%',
                        end: 'bottom 10%',
                        scrub: 1,
                    },
                });

                tl.fromTo(
                    '.slide-up-and-fade',
                    { y: 0 },
                    { y: -150, opacity: 0, stagger: 0.02 },
                );
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="relative overflow-hidden" id="banner">
            <CubeAnimation />
            <div
                className="container h-[100svh] min-h-[530px] max-md:pb-10 flex justify-between items-center max-md:flex-col"
                ref={containerRef}
            >
                <div className="max-md:grow max-md:flex flex-col justify-center items-start max-w-[544px]">
                    <h1 className="banner-title slide-up-and-fade leading-[.95] text-6xl sm:text-[80px] font-anton select-none">
                        <span className="text-primary">{t('banner.title_line1')}</span>
                        <br /> <span className="ml-4">{t('banner.title_line2')}</span>
                    </h1>
                    <div className="banner-description slide-up-and-fade mt-6 text-lg text-muted-foreground min-h-[140px] xs:min-h-[110px] sm:min-h-[84px] md:min-h-[56px]">
                        {isPreloaderComplete && (
                            <TypingText
                                text={cleanedDescription}
                                highlightWord="Long"
                                speed={15}
                            />
                        )}
                    </div>
                    <Button
                        as="link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`mailto:${GENERAL_INFO.email}`}
                        variant="primary"
                        className="mt-9 banner-button slide-up-and-fade"
                    >
                        {t('banner.cta')}
                    </Button>

                </div>

                <div className="md:absolute bottom-[10%] right-[4%] flex md:flex-col gap-4 md:gap-8 text-center md:text-right">
                    <div className="slide-up-and-fade">
                        <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
                            {PROJECTS.length}
                        </h5>
                        <p className="text-muted-foreground">
                            {t('banner.stat_projects')}
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
                            {awardsCount}
                        </h5>
                        <p className="text-muted-foreground">
                            {t('banner.stat_awards')}
                        </p>
                    </div>
                    <div className="slide-up-and-fade">
                        <h5 className="text-3xl sm:text-4xl font-anton text-primary mb-1.5">
                            {codingYears}
                        </h5>
                        <p className="text-muted-foreground">
                            {t('banner.stat_years')}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;

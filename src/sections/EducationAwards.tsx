import SectionTitle from '@/components/SectionTitle';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface Award {
    title: string;
    event: string;
    year: string;
}

const EducationAwards = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();
    const rawAwards = t('education.awards', { returnObjects: true }) as Award[];
    const awards = [...rawAwards].sort((a, b) => {
        const maxYear = (s: string) => Math.max(...s.split(',').map(y => parseInt(y.trim())));
        return maxYear(b.year) - maxYear(a.year);
    });

    // Stagger reveal each item on scroll
    useGSAP(
        () => {
            gsap.from('.edu-item', {
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                    toggleActions: 'play none none reverse',
                },
            });
        },
        { scope: containerRef },
    );

    // Fade out on scroll past (desktop only)
    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(min-width: 768px)', () => {
                gsap.to(containerRef.current, {
                    y: -150,
                    opacity: 0,
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'bottom 50%',
                        end: 'bottom 20%',
                        scrub: 1,
                    },
                });
            });
        },
        { scope: containerRef },
    );

    return (
        <section className="py-section" id="education-awards">
            <div className="container" ref={containerRef}>
                <SectionTitle title={t('sections.education_awards')} />

                {/* Education */}
                <div className="edu-item mb-14">
                    <p className="text-xl text-muted-foreground">
                        {t('education.university')}
                    </p>
                    <p className="text-4xl sm:text-5xl font-anton leading-[1.15] mt-4 mb-3">
                        {t('education.degree')}
                    </p>
                    <p className="text-lg text-muted-foreground">
                        {t('education.period')}
                    </p>
                </div>

                {/* Awards */}
                <div className="edu-item">
                    <p className="text-2xl font-anton text-primary mb-8">
                        {t('education.awards_title')}
                    </p>
                    <div className="space-y-0">
                        {awards.map((award, idx) => (
                            <div
                                key={`${award.title}-${award.year}-${idx}`}
                                className="edu-item group grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] items-baseline gap-x-6 gap-y-1 py-4 border-b border-foreground/10 hover:bg-foreground/[0.03] transition-colors -mx-4 px-4 rounded-sm"
                            >
                                <span className="text-lg font-medium">
                                    {award.title}
                                </span>
                                <span className="text-muted-foreground text-sm sm:text-base">
                                    {award.event}
                                </span>
                                <span className="text-muted-foreground tabular-nums text-sm sm:text-base sm:text-right">
                                    {award.year}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EducationAwards;

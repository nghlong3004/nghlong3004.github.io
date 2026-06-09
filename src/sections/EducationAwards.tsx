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

    useGSAP(
        () => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 60%',
                    end: 'bottom 50%',
                    toggleActions: 'restart none none reverse',
                    scrub: 1,
                },
            });

            tl.from('.edu-item', {
                y: 50,
                opacity: 0,
                stagger: 0.3,
            });
        },
        { scope: containerRef },
    );

    useGSAP(
        () => {
            const mm = gsap.matchMedia();
            mm.add('(min-width: 768px)', () => {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'bottom 50%',
                        end: 'bottom 20%',
                        scrub: 1,
                    },
                });

                tl.to(containerRef.current, {
                    y: -150,
                    opacity: 0,
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
                    <div className="grid gap-6">
                        {awards.map((award) => (
                            <div
                                key={`${award.title}-${award.year}`}
                                className="edu-item flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6"
                            >
                                <span className="text-lg font-medium min-w-[280px]">
                                    {award.title}
                                </span>
                                <span className="text-muted-foreground">
                                    {award.event}
                                </span>
                                <span className="text-muted-foreground sm:ml-auto">
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

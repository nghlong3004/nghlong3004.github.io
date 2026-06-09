import SectionTitle from '@/components/SectionTitle';
import { MY_STACK } from '@/lib/data';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { useRef, type ComponentType } from 'react';
import { useTranslation } from 'react-i18next';
import {
    SiOpenjdk,
    SiSpringboot,
    SiPostgresql,
    SiRedis,
    SiDocker,
    SiNginx,
    SiLinux,
    SiPrometheus,
    SiGrafana,
    SiPython,
    SiCplusplus,
    SiGit,
    SiPostman,
    SiIntellijidea,
    SiFlyway,
    SiJsonwebtokens,
    SiHibernate,
} from '@icons-pack/react-simple-icons';
import {
    Code2,
    Globe,
    Radio,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Icon config: name → { Icon, color }
// 'default' = brand color from Simple Icons
// 'currentColor' = inherits text color (auto light/dark)
// '#hex' = custom fixed color
const ICONS: Record<string, { Icon: ComponentType<{ size?: number; color?: string }>; color: string }> = {
    'Java': { Icon: SiOpenjdk, color: 'default' },
    'Spring Boot': { Icon: SiSpringboot, color: 'default' },
    'RESTful API': { Icon: Globe, color: '#6366F1' },
    'WebSocket': { Icon: Radio, color: '#10B981' },
    'OAuth2/JWT': { Icon: SiJsonwebtokens, color: 'default' },
    'JPA': { Icon: SiHibernate, color: 'default' },
    'Flyway': { Icon: SiFlyway, color: 'default' },
    'PostgreSQL': { Icon: SiPostgresql, color: 'default' },
    'Redis': { Icon: SiRedis, color: 'default' },
    'Docker': { Icon: SiDocker, color: 'default' },
    'Nginx': { Icon: SiNginx, color: 'default' },
    'Linux': { Icon: SiLinux, color: 'currentColor' },
    'Prometheus': { Icon: SiPrometheus, color: 'default' },
    'Grafana': { Icon: SiGrafana, color: 'default' },
    'Python': { Icon: SiPython, color: 'default' },
    'C/C++': { Icon: SiCplusplus, color: 'default' },
    'Git': { Icon: SiGit, color: 'default' },
    'Postman': { Icon: SiPostman, color: 'default' },
    'IntelliJ IDEA': { Icon: SiIntellijidea, color: 'currentColor' },
};

const SkillIcon = ({ name }: { name: string }) => {
    const entry = ICONS[name];
    if (!entry) return <Code2 size={36} className="text-muted-foreground" />;
    const { Icon, color } = entry;
    return <Icon size={36} color={color} />;
};

const Skills = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation();

    useGSAP(
        () => {
            const slideUpEl =
                containerRef.current?.querySelectorAll('.slide-up');

            if (!slideUpEl?.length) return;

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 80%',
                    end: 'bottom 80%',
                    scrub: 0.5,
                },
            });

            tl.from('.slide-up', {
                opacity: 0,
                y: 40,
                ease: 'none',
                stagger: 0.4,
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
                        end: 'bottom 10%',
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
        <section className="py-section" id="my-stack" ref={containerRef}>
            <div className="container">
                <SectionTitle title={t('sections.my_stack')} />

                <div className="space-y-20">
                    {Object.entries(MY_STACK).map(([key, items]) => (
                        <div className="grid sm:grid-cols-12" key={key}>
                            <div className="sm:col-span-5">
                                <p className="slide-up text-5xl font-anton leading-none text-muted-foreground uppercase">
                                    {key}
                                </p>
                            </div>

                            <div className="sm:col-span-7 flex gap-x-11 gap-y-9 flex-wrap">
                                {items.map((name) => (
                                    <div
                                        className="slide-up flex gap-3.5 items-center leading-none"
                                        key={name}
                                    >
                                        <SkillIcon name={name} />
                                        <span className="text-2xl">
                                            {name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;

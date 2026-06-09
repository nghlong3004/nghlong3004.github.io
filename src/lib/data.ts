import type { IProject } from '@/types';

export const GENERAL_INFO = {
    email: 'nghlong3004@gmail.com',
    github: 'https://github.com/nghlong3004',
    targetRole: 'Backend Developer Intern',
};

export const SOCIAL_LINKS = [
    { name: 'github', url: 'https://github.com/nghlong3004' },
];

export const MY_STACK: Record<string, string[]> = {
    backend: ['Java', 'Spring Boot', 'RESTful API', 'WebSocket', 'OAuth2/JWT', 'JPA', 'Flyway'],
    database: ['PostgreSQL', 'Redis'],
    devops: ['Docker', 'Nginx', 'Linux', 'Prometheus', 'Grafana'],
    languages: ['Python', 'C/C++'],
    tools: ['Git', 'Postman', 'IntelliJ IDEA'],
};

export const PROJECTS: IProject[] = [
    {
        title: 'VinQA',
        slug: 'vinqa',
        year: 2026,
        liveUrl: 'https://a20-app-054.nghlong3004.me/',
        techStack: [
            'Spring Boot',
            'React',
            'PostgreSQL',
            'Redis',
            'Docker',
            'Python',
            'Playwright',
            'Lighthouse',
        ],
        description: 'projects_data.vinqa.description',
        role: 'projects_data.vinqa.role',
        thumbnail: '/projects/thumbnail/vinqa.webp',
        longThumbnail: '/projects/long/vinqa.webp',
        images: [
            '/projects/images/vinqa_1.webp',
            '/projects/images/vinqa_2.webp',
        ],
    },
    {
        title: 'Olympic HUMG',
        slug: 'olympic-humg',
        year: 2025,
        liveUrl: 'https://olympic.humg.edu.vn',
        techStack: [
            'Spring Boot',
            'React',
            'PostgreSQL',
            'Redis',
            'Flyway',
            'Docker',
            'Nginx',
            'OAuth2/JWT',
        ],
        description: 'projects_data.olympic_humg.description',
        role: 'projects_data.olympic_humg.role',
        thumbnail: '/projects/thumbnail/olympic-humg.webp',
        longThumbnail: '/projects/long/olympic-humg.webp',
        images: [
            '/projects/images/olympic-humg_1.webp',
            '/projects/images/olympic-humg_2.webp',
        ],
    },
    {
        title: 'Boom Online',
        slug: 'boom-online',
        year: 2025,
        sourceCode: 'https://github.com/nghlong3004/boom-online',
        techStack: [
            'Spring Boot',
            'WebSocket',
            'Java Swing',
            'PostgreSQL',
            'Flyway',
        ],
        description: 'projects_data.boom_online.description',
        role: 'projects_data.boom_online.role',
        thumbnail: '/projects/thumbnail/boom-online.webp',
        longThumbnail: '/projects/long/boom-online.webp',
        images: [
            '/projects/images/boom-1.webp',
            '/projects/images/boom-2.webp',
        ],
    },
];

export const MY_EDUCATION = {
    university: 'Hanoi University of Mining and Geology',
    degree: 'B.Eng. in Control Engineering and Automation',
    period: '09/2023 - Present',
};

export const MY_AWARDS = [
    {
        title: 'Third Prize — Calculus',
        event: 'National Mathematics Olympiad',
        year: '2025, 2026',
    },
    {
        title: 'Third Prize — Linear Algebra',
        event: 'National Mathematics Olympiad',
        year: '2024',
    },
    {
        title: 'Consolation Prize — Algebra',
        event: 'National Mathematics Olympiad',
        year: '2025',
    },
    {
        title: 'Second Prize — Informatics',
        event: 'Provincial Contest, Grade 12',
        year: '2023',
    },
    {
        title: 'Consolation Prize — Informatics',
        event: 'Provincial Contest, Grade 11',
        year: '2022',
    },
];

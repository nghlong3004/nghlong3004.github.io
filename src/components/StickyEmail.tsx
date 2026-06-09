import { GENERAL_INFO } from '@/lib/data';

const StickyEmail = () => {
    return (
        <div
            className="max-xl:hidden fixed bottom-0 left-10 z-[1] text-muted-foreground flex flex-col gap-7 items-center"
            style={{ writingMode: 'vertical-rl' }}
        >
            <a
                href={`mailto:${GENERAL_INFO.email}`}
                className="hover:text-primary transition-colors"
            >
                {GENERAL_INFO.email}
            </a>
            <span className="inline-block w-[1px] h-24 bg-muted-foreground"></span>
        </div>
    );
};

export default StickyEmail;

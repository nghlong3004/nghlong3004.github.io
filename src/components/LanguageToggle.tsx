import { useTranslation } from 'react-i18next';

const LanguageToggle = () => {
    const { i18n } = useTranslation();

    const toggle = () => {
        const next = i18n.language === 'vi' ? 'en' : 'vi';
        i18n.changeLanguage(next);
        localStorage.setItem('lang', next);
    };

    return (
        <button
            onClick={toggle}
            className="size-10 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-foreground/10 active:scale-95 transition-all text-sm font-medium"
            aria-label="Toggle language"
            title={i18n.language === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
        >
            {i18n.language === 'vi' ? '🇻🇳' : '🇬🇧'}
        </button>
    );
};

export default LanguageToggle;

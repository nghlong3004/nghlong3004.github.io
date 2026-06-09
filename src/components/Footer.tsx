import { GENERAL_INFO } from '@/lib/data';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="text-center pb-5" id="contact">
            <div className="container">
                <p className="text-lg">{t('footer.have_project')}</p>
                <a
                    href={`mailto:${GENERAL_INFO.email}`}
                    className="text-3xl sm:text-4xl font-anton inline-block mt-5 mb-10 hover:underline"
                >
                    {GENERAL_INFO.email}
                </a>

                <div className="text-sm text-muted-foreground">
                    <p>{t('footer.built_by')}</p>
                    <p className="mt-1">© {new Date().getFullYear()} Nguyen Hoang Long</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

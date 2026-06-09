import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Banner from '@/sections/Banner';
import AboutMe from '@/sections/AboutMe';
import Skills from '@/sections/Skills';
import EducationAwards from '@/sections/EducationAwards';
import ProjectList from '@/sections/ProjectList';

const HomePage = () => {
    const { t } = useTranslation();

    return (
        <>
            <Helmet>
                <title>{t('seo.home_title')}</title>
                <meta name="description" content={t('seo.home_description')} />
            </Helmet>

            <Banner />
            <AboutMe />
            <ProjectList />
            <Skills />
            <EducationAwards />
        </>
    );
};

export default HomePage;

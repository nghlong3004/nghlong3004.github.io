import { Navigate, useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { PROJECTS } from '@/lib/data';
import ProjectDetails from '@/sections/ProjectDetails';

const ProjectPage = () => {
    const { slug } = useParams();
    const project = PROJECTS.find((p) => p.slug === slug);

    if (!project) return <Navigate to="/" replace />;

    return (
        <>
            <Helmet>
                <title>{`${project.title} — Nguyen Hoang Long`}</title>
                <meta
                    name="description"
                    content={`${project.title} — ${project.techStack.join(', ')}`}
                />
            </Helmet>
            <ProjectDetails project={project} />
        </>
    );
};

export default ProjectPage;

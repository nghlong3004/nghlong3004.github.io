import { createBrowserRouter } from 'react-router';
import { lazy, Suspense } from 'react';
import RootLayout from '@/layouts/RootLayout';

const HomePage = lazy(() => import('@/pages/HomePage'));
const ProjectPage = lazy(() => import('@/pages/ProjectPage'));

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense>
                        <HomePage />
                    </Suspense>
                ),
            },
            {
                path: 'projects/:slug',
                element: (
                    <Suspense>
                        <ProjectPage />
                    </Suspense>
                ),
            },
        ],
    },
]);

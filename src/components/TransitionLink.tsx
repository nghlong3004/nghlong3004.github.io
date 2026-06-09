import { Link, useNavigate } from 'react-router';
import React, { type ComponentProps } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

interface Props extends ComponentProps<typeof Link> {
    back?: boolean;
}

gsap.registerPlugin(useGSAP);

const TransitionLink = ({
    to,
    onClick,
    children,
    back = false,
    ...rest
}: Props) => {
    const navigate = useNavigate();

    const { contextSafe } = useGSAP(() => {});

    const handleLinkClick = contextSafe(
        async (e: React.MouseEvent<HTMLAnchorElement>) => {
            e.preventDefault();

            gsap.set('.page-transition', { yPercent: 100 });
            gsap.set('.page-transition--inner', { yPercent: 100 });

            const tl = gsap.timeline();

            tl.to('.page-transition', {
                yPercent: 0,
                duration: 0.3,
                ease: 'power2.out',
            });

            tl.then(() => {
                if (back) {
                    navigate(-1);
                } else if (to) {
                    navigate(to.toString());
                } else if (onClick) {
                    onClick(e);
                }
            });
        },
    );

    return (
        <Link to={to} {...rest} onClick={handleLinkClick}>
            {children}
        </Link>
    );
};

export default TransitionLink;

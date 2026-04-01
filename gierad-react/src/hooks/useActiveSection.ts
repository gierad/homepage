import { useState, useEffect } from 'react';

/**
 * Observes an array of section IDs and returns the one currently intersecting
 * the vertical center of the viewport to drive Navigation Link highlighting.
 */
export function useActiveSection(sectionIds: string[], rootMargin: string = '-40% 0px -40% 0px') {
    const [activeSection, setActiveSection] = useState<string>('');

    useEffect(() => {
        if (!window.IntersectionObserver) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { rootMargin, threshold: 0 }
        );

        sectionIds.forEach((id) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [sectionIds.join(','), rootMargin]);

    return activeSection;
}

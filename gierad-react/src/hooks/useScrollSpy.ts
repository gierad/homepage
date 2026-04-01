import { useEffect, useRef } from 'react';

export function useScrollSpy(itemSelector: string, activeClass: string, rootMargin: string = '-42.5% 0px -42.5% 0px') {
    const containerRef = useRef<any>(null);

    useEffect(() => {
        if (!window.IntersectionObserver) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(activeClass);
                } else {
                    entry.target.classList.remove(activeClass);
                }
            });
        }, {
            rootMargin,
            threshold: 0
        });

        if (containerRef.current) {
            // Using requestAnimationFrame to ensure children are rendered before selecting
            requestAnimationFrame(() => {
                if (containerRef.current) {
                    const elements = containerRef.current.querySelectorAll(itemSelector);
                    elements.forEach((el: Element) => observer.observe(el));
                }
            });
        }

        return () => observer.disconnect();
    }, [itemSelector, activeClass, rootMargin]);

    return containerRef;
}

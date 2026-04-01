import { useState, useEffect } from 'react';
import styles from './Gallery.module.css';
import { galleryData } from '../data/cv';
import { useScrollSpy } from '../hooks/useScrollSpy';

export default function Gallery() {
    const listRef = useScrollSpy(`.${styles.item}`, styles.active);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedIndex(null);
            if (selectedIndex !== null) {
                if (e.key === 'ArrowRight') setSelectedIndex((selectedIndex + 1) % galleryData.length);
                if (e.key === 'ArrowLeft') setSelectedIndex((selectedIndex - 1 + galleryData.length) % galleryData.length);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    return (
        <section id="photography" className={styles.section}>
            <h2 className={styles.sectionTitle}>Photography</h2>
            <p className="section-subtitle">
                My idea of a happy life is being with family and friends, travelling, learning, and pursuing creative projects. I'm currently into photography— here a few of my favorite shots. High-res versions are available upon request.
            </p>
            <div className={styles.grid} ref={listRef}>
                {galleryData.map((photo, idx) => (
                    <div
                        key={idx}
                        className={styles.item}
                        onClick={() => openLightbox(idx)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View larger version of ${photo.title || 'photo'}`}
                    >
                        <img
                            src={photo.src}
                            alt={photo.title || "Photography Visual"}
                            className={styles.image}
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>

            {selectedIndex !== null && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.closeBtn} onClick={closeLightbox} aria-label="Close lightbox">
                        &times;
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <img
                            src={galleryData[selectedIndex].src}
                            alt={galleryData[selectedIndex].title || "Expanded photography"}
                            className={styles.expandedImage}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

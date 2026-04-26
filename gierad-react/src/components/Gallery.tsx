import { useState, useEffect } from 'react';
import styles from './Gallery.module.css';
import { galleryData } from '../data/cv';
import { useScrollSpy } from '../hooks/useScrollSpy';

export default function Gallery() {
    const listRef = useScrollSpy(`.${styles.item}`, styles.active);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [columns, setColumns] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            setColumns(window.innerWidth > 900 ? 3 : 2);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    // Distribute data horizontally to preserve left-to-right flow across columns
    const colData = Array.from({ length: columns }, () => [] as { photo: typeof galleryData[0], originalIndex: number }[]);
    galleryData.forEach((photo, idx) => {
        let colIndex = idx % columns;
        // If it's the absolute last item, force it into the last column so it visually anchors the end of the gallery
        if (idx === galleryData.length - 1) {
            colIndex = columns - 1;
        }
        colData[colIndex].push({ photo, originalIndex: idx });
    });
    return (
        <section id="photography" className={styles.section}>
            <h2 className={styles.sectionTitle}>Photography</h2>
            <p className="section-subtitle">
                My photography is highly influenced by Sebastião Salgado, Ansel Adams, Fan Ho, Chang Chao-Tang, Eliott Erwitt, Alex Webb, and Rebecca Norris Webb. I combine techniques from landscape photography, street photography, and computational photography to capture stories and decisive moments from images.
            </p>

            <h3 className={styles.projectTitle}>Current Project: Already Immortal</h3>

            <blockquote className={styles.poemQuote}>
                <p className={styles.poemText}>
                    "...amid Nature's loving destructions, her beautiful deaths. Talk of immortality!<br />
                    After a whole day in the woods, we are already immortal.<br />
                    When is the end of such a day?"
                </p>
                <footer className={styles.poemFooter}>
                    <span className={styles.poemAuthor}>— John Muir</span>
                    <cite className={styles.poemCite}>
                        Yosemite, California, 1875
                    </cite>
                </footer>
            </blockquote>

            <p className={styles.projectDescription}>
                I'm currently authoring a monograph exploring the vast scales of time, contrasting human fragility against nature's immense, unyielding geological timeline. Triggered by my wife's recent cancer diagnosis — thankfully, she is well — this project is a meditation on life's brevity and our shared love for nature and adventure. Using our mission to visit all 63 U.S. National Parks as a backdrop, this work captures the tension between fleeting human experience and nature's relentless forward momentum. Through my photographs, I aim to show that human struggles can become transformative, in much the same way as violent eruptions, shifting tectonic plates, and relentless erosion create undeniable beauty of their own.
            </p>

            <div className={styles.grid} ref={listRef}>
                {colData.map((col, colIdx) => (
                    <div key={colIdx} className={styles.column}>
                        {col.map(({ photo, originalIndex }) => (
                            <div
                                key={originalIndex}
                                className={styles.item}
                                onClick={() => openLightbox(originalIndex)}
                                role="button"
                                tabIndex={0}
                                aria-label={`View larger version of ${photo.title || 'photo'}`}
                            >
                                <img
                                    src={photo.src}
                                    alt={photo.title || "Photography Visual"}
                                    className={styles.image}
                                    loading="lazy"
                                    onContextMenu={(e) => e.preventDefault()}
                                />
                            </div>
                        ))}
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
                            onContextMenu={(e) => e.preventDefault()}
                        />
                    </div>
                </div>
            )}
        </section>
    );
}

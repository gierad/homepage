import { publicationsData } from '../data/cv';
import styles from './Publications.module.css';
import { ExternalLink } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';

interface Publication {
    title: string;
    description: string;
    link: string;
    imgSrc?: string;
}

export default function Publications() {
    const listRef = useScrollSpy(`.${styles.item}`, styles.active);

    return (
        <section id="publications" className={styles.section}>
            <h2 className={styles.sectionTitle}>Selected Publications & Projects</h2>
            <div className={styles.list} ref={listRef}>
                {(publicationsData as Publication[]).map((pub, idx) => (
                    <a key={idx} href={pub.link} target="_blank" rel="noopener noreferrer" className={styles.item}>
                        {pub.imgSrc && (
                            <div className={styles.imageContainer}>
                                <img src={pub.imgSrc} alt={pub.title} className={styles.image} />
                            </div>
                        )}
                        <div className={styles.content}>
                            <h3 className={styles.title}>
                                {pub.title}
                                <ExternalLink size={14} className={styles.icon} />
                            </h3>
                            <p className={styles.description}>{pub.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

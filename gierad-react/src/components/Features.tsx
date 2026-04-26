import { featuresData } from '../data/cv';
import styles from './Features.module.css';
import { ExternalLink } from 'lucide-react';
import { useScrollSpy } from '../hooks/useScrollSpy';

export default function Features() {
    const listRef = useScrollSpy(`.${styles.item}`, styles.active);

    if (!featuresData || featuresData.length === 0) return null;

    return (
        <section id="features" className={styles.section}>
            <h2 className={styles.sectionTitle}>Selected Features Shipped</h2>
            <p className="section-subtitle">We collaborate (daily!) with multiple product teams across Apple. Here are select features and products where we've made significant contributions and continue to maintain:</p>
            <div className={styles.list} ref={listRef}>
                {featuresData.map((feature, idx) => (
                    <a key={idx} href={feature.link} target="_blank" rel="noopener noreferrer" className={styles.item}>
                        {feature.imgSrc && (
                            <div className={styles.imageContainer}>
                                <img src={feature.imgSrc} alt={feature.title} className={styles.image} />
                            </div>
                        )}
                        <div className={styles.content}>
                            <h3 className={styles.title}>
                                {feature.title}
                                <ExternalLink size={14} className={styles.icon} />
                            </h3>
                            <p className={styles.description}>{feature.description}</p>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    );
}

import { educationData } from '../data/cv';
import styles from './Experience.module.css'; // Reusing Experience CSS for identical visual structure
import { useScrollSpy } from '../hooks/useScrollSpy';

export default function Education() {
    const listRef = useScrollSpy(`.${styles.item}`, styles.active);

    return (
        <section id="education" className={styles.section}>
            <h2 className={styles.sectionTitle}>Education</h2>
            <div className={styles.list} ref={listRef}>
                {educationData.map((edu, idx) => (
                    <div key={idx} className={styles.item}>
                        <div className={styles.meta}>
                            {edu.imgSrc && (
                                <div className={styles.logoContainer}>
                                    <img
                                        src={edu.imgSrc}
                                        alt={edu.school}
                                        className={`${styles.logo} ${(edu as any).darkImgSrc ? styles.logoLight + ' ' + styles.hasDarkAlt : ''} ${edu.invertInDark ? 'invertInDark' : ''}`}
                                    />
                                    {(edu as any).darkImgSrc && (
                                        <img
                                            src={(edu as any).darkImgSrc}
                                            alt={edu.school + ' Dark Mode'}
                                            className={`${styles.logo} ${styles.logoDark}`}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.content}>
                            <h3 className={styles.company}>{edu.school}</h3>
                            <p className={styles.role}>{edu.degree}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

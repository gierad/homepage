import { experienceData } from '../data/cv';
import styles from './Experience.module.css';
import { useScrollSpy } from '../hooks/useScrollSpy';

export default function Experience() {
    const listRef = useScrollSpy(`.${styles.item}`, styles.active);

    return (
        <section id="experience" className={styles.section}>
            <h2 className={styles.sectionTitle}>Experience</h2>
            <div className={styles.list} ref={listRef}>
                {experienceData.map((exp, idx) => (
                    <div key={idx} className={styles.item}>
                        <div className={styles.meta}>
                            {exp.imgSrc && (
                                <div className={styles.logoContainer}>
                                    <img
                                        src={exp.imgSrc}
                                        alt={exp.company}
                                        className={`${styles.logo} ${(exp as any).darkImgSrc ? styles.logoLight + ' ' + styles.hasDarkAlt : ''} ${exp.invertInDark ? 'invertInDark' : ''}`}
                                        style={(exp as any).scale ? { '--logo-scale': (exp as any).scale } as React.CSSProperties : {}}
                                    />
                                    {(exp as any).darkImgSrc && (
                                        <img
                                            src={(exp as any).darkImgSrc}
                                            alt={exp.company + ' Dark Mode'}
                                            className={`${styles.logo} ${styles.logoDark}`}
                                            style={(exp as any).scale ? { '--logo-scale': (exp as any).scale } as React.CSSProperties : {}}
                                        />
                                    )}
                                </div>
                            )}
                        </div>
                        <div className={styles.content}>
                            <h3 className={styles.company}>{exp.company}</h3>
                            <p className={styles.role}>
                                {exp.role} &bull; <span className={styles.years}>{exp.years}</span>
                            </p>
                            <p className={styles.details}>{exp.details}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

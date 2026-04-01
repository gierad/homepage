import { aboutData } from '../data/cv';
import styles from './Hero.module.css';
import { Mail, Instagram, GraduationCap } from 'lucide-react';

export default function Hero() {
    return (
        <section id="hero" className={styles.hero}>
            <div className={styles.header}>
                <img src="/images/team/gierad_portrait.jpg" alt={aboutData.name} className={styles.profilePic} />
                <div className={styles.headerText}>
                    <h1 className={styles.title}>{aboutData.name}</h1>
                    <h2 className={styles.subtitle}>{aboutData.title}, {aboutData.company}</h2>
                </div>
            </div>

            <div className={styles.bio}>
                {aboutData.bio.map((paragraph, idx) => (
                    <p key={idx} className={styles.paragraph}>{paragraph}</p>
                ))}
            </div>

            <div className={styles.links}>
                <a href={aboutData.links.email} className={styles.iconLink} aria-label="Email"><Mail size={20} strokeWidth={1.5} /></a>
                <a href={aboutData.links.scholar} className={styles.iconLink} aria-label="Google Scholar"><GraduationCap size={20} strokeWidth={1.5} /></a>
                <a href={aboutData.links.instagram} className={styles.iconLink} aria-label="Instagram"><Instagram size={20} strokeWidth={1.5} /></a>
            </div>
        </section>
    );
}

import styles from './About.module.css';

export default function About() {
    return (
        <section id="about" className={styles.section}>
            <div className={styles.grid}>
                <div className={styles.textBlock}>
                    <h2 className={styles.heading}>About Me</h2>
                    <p className={styles.paragraph}>
                        I am a technologist and researcher exploring the intersection of human-computer interaction, ubiquitous computing, and artificial intelligence. My work focuses on building novel sensing systems to create more intelligent, seamless experiences.
                    </p>
                    <p className={styles.paragraph}>
                        Currently, I am an engineer at Apple, helping shape the future of intelligent devices. Previously, I completed my Ph.D. at Carnegie Mellon University in the Human-Computer Interaction Institute.
                    </p>
                </div>
                <div className={styles.imageBlock}>
                    {/* Elegant Reseda-style inset image */}
                    <div className={styles.imagePlaceholder}></div>
                </div>
            </div>
        </section>
    );
}

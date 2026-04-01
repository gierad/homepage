import { aboutData } from '../data/cv';
import styles from './Navbar.module.css';
import { useActiveSection } from '../hooks/useActiveSection';

export default function Navbar() {
    // Top-level sections to spy on
    const activeSection = useActiveSection(['hero', 'education', 'features', 'publications', 'personal', 'gallery', 'roadtrips']);

    return (
        <header className={styles.header}>
            <a href="#hero" className={`${styles.logo} ${activeSection === 'hero' ? styles.active : ''}`}>
                {aboutData.name}
            </a>
            <nav className={styles.nav}>
                <a href="#education" className={`${styles.navLink} ${activeSection === 'education' ? styles.active : ''}`}>
                    About
                </a>
                <a href="#features" className={`${styles.navLink} ${activeSection === 'features' ? styles.active : ''}`}>
                    Shipped
                </a>
                <a href="#publications" className={`${styles.navLink} ${activeSection === 'publications' ? styles.active : ''}`}>
                    Publications
                </a>
                <a href="#personal" className={`${styles.navLink} ${(activeSection === 'personal' || activeSection === 'gallery' || activeSection === 'roadtrips') ? styles.active : ''}`}>
                    Personal
                </a>
            </nav>
        </header>
    );
}

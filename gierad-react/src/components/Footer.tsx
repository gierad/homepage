import styles from './Footer.module.css';
import { aboutData } from '../data/cv';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <p className={styles.copyright}>
                        &copy; {currentYear} {aboutData.name}. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

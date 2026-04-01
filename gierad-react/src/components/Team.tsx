import { teamData, alumniData } from '../data/cv';
import styles from './Team.module.css';
import { useScrollSpy } from '../hooks/useScrollSpy';

export default function Team() {
    const listRef = useScrollSpy(`.${styles.member}`, styles.active);

    const hasTeam = teamData && teamData.length > 0;
    const hasAlumni = alumniData && alumniData.length > 0;

    if (!hasTeam && !hasAlumni) return null;

    return (
        <section id="team" className={styles.section} ref={listRef}>
            <h2 className={styles.sectionTitle}>Team & Mentorship</h2>

            {hasTeam && (
                <div className={styles.group}>
                    <h3 className={styles.groupTitle}>Current Team</h3>
                    <div className={styles.grid}>
                        {teamData.map((member, idx) => (
                            <div key={idx} className={styles.member}>
                                {member.imgSrc && (
                                    <img src={member.imgSrc} alt={member.name} className={styles.avatar} />
                                )}
                                <div className={styles.info}>
                                    <div className={styles.name}>{member.link ? <a href={member.link} target="_blank" rel="noopener noreferrer">{member.name}</a> : member.name}</div>
                                    <div className={styles.role}>{member.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {hasAlumni && (
                <div className={styles.group}>
                    <h3 className={styles.groupTitle}>Alumni</h3>
                    <div className={styles.grid}>
                        {alumniData.map((member, idx) => (
                            <div key={`alumni-${idx}`} className={styles.member}>
                                {member.imgSrc && (
                                    <img src={member.imgSrc} alt={member.name} className={styles.avatar} />
                                )}
                                <div className={styles.info}>
                                    <div className={styles.name}>{member.link ? <a href={member.link} target="_blank" rel="noopener noreferrer">{member.name}</a> : member.name}</div>
                                    <div className={styles.role}>{member.role}</div>
                                    {member.current && <div className={styles.current}>{member.current}</div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}

import { useState, useRef, useEffect } from 'react';
import { serviceData, talksData, teachingData, reviewingData, pressData } from '../data/cv';
import styles from './Misc.module.css';
import { useScrollSpy } from '../hooks/useScrollSpy';

const MagneticTimeline = ({ data }: { data: (string | unknown)[] }) => {
    const listRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (!listRef.current) return;
        const observer = new ResizeObserver((entries) => {
            setHeight(entries[0].contentRect.height);
        });
        observer.observe(listRef.current);
        setHeight(listRef.current.getBoundingClientRect().height);
        return () => observer.disconnect();
    }, [data]);

    useEffect(() => {
        let animationFrameId: number;

        const updatePath = () => {
            if (!listRef.current || !pathRef.current || height === 0) return;
            const rect = listRef.current.getBoundingClientRect();
            const viewportCenter = window.innerHeight / 2;
            const bendY = viewportCenter - rect.top;
            
            // Render the bend slightly past the boundaries to allow the curve to smoothly enter/exit
            if (bendY > -300 && bendY < height + 300) {
                const baseX = 4;
                const pullX = 14; 
                const radiusY = 120; // Smoother, wider spread
                
                const startY = Math.max(0, bendY - radiusY);
                const endY = Math.min(height, bendY + radiusY);
                
                const pathData = `M ${baseX} 0 L ${baseX} ${startY} C ${baseX} ${bendY - radiusY/2}, ${baseX + pullX} ${bendY - radiusY/4}, ${baseX + pullX} ${bendY} C ${baseX + pullX} ${bendY + radiusY/4}, ${baseX} ${bendY + radiusY/2}, ${baseX} ${endY} L ${baseX} ${height}`;
                
                pathRef.current.setAttribute('d', pathData);
            }
        };

        const handleScroll = () => {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(updatePath);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Initial paint
        return () => {
            window.removeEventListener('scroll', handleScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [height]);

    // Initial linear draw string
    const initialPath = `M 4 0 L 4 ${height}`;

    return (
        <div ref={listRef} className={styles.dynamicTimelineContainer}>
            <svg className={styles.dynamicTimelineSvg} width="30" height={height}>
                <path 
                    ref={pathRef}
                    d={initialPath} 
                    stroke="var(--text-primary)" 
                    opacity="0.15"
                    strokeWidth="1.5" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
            <div className={styles.dynamicTimelineContent}>
                {data.map((item, idx) => {
                    const itemStr = String(item);
                    return (
                        <div key={idx} className={styles.timelineItem}>
                            <div className={styles.timelineYear}>{itemStr.substring(0, 4)}</div>
                            <div className={styles.timelineText}>{itemStr.substring(5)}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function Misc() {
    const sectionRef = useScrollSpy(`.${styles.pressItem}, .${styles.simpleItem}, .${styles.teachingCard}, .${styles.reviewPill}`, styles.active);

    return (
        <section id="misc" className={styles.section} ref={sectionRef}>

            {pressData && pressData.length > 0 && (
                <div className={styles.group}>
                    <h2 className={styles.sectionTitle}>Selected Press</h2>
                    <div className={styles.pressList}>
                        {pressData.map((item, idx) => (
                            <div key={idx} className={styles.pressItem}>
                                <span className={styles.year}>{item.year}</span>
                                <span className={styles.publication}>{item.publication}</span>
                                {item.link ? (
                                    <a href={item.link} target="_blank" rel="noopener noreferrer" className={styles.pressTitle}>
                                        "{item.title}"
                                    </a>
                                ) : (
                                    <span className={styles.pressTitle}>"{item.title}"</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {serviceData && serviceData.length > 0 && (
                <div className={styles.group}>
                    <h2 className={styles.sectionTitle}>Academic Service</h2>
                    <MagneticTimeline data={serviceData} />
                </div>
            )}

            {talksData && talksData.length > 0 && (
                <div className={styles.group}>
                    <h2 className={styles.sectionTitle}>Invited Talks</h2>
                    <MagneticTimeline data={talksData} />
                </div>
            )}

            <div className={styles.twoColumn}>
                {teachingData && teachingData.length > 0 && (
                    <div className={styles.column}>
                        <h2 className={styles.sectionTitle}>Teaching</h2>
                        <div className={styles.teachingCards}>
                            {teachingData.map((item, idx) => {
                                const match = item.match(/^([^,]+),\s*(.+?)(?:,\s*(\d{4}(?:-\d{4})?))?$/);
                                const school = match ? match[1] : item;
                                const course = match ? match[2] : "";
                                const year = match && match[3] ? match[3] : "";
                                return (
                                <div key={idx} className={styles.teachingCard}>
                                    <div className={styles.teachingHeader}>
                                        <div className={styles.teachingCourse}>{course}</div>
                                        {year && <span className={styles.teachingYearBadge}>{year}</span>}
                                    </div>
                                    <div className={styles.teachingSchool}>{school}</div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {reviewingData && reviewingData.length > 0 && (
                    <div className={styles.column}>
                        <h2 className={styles.sectionTitle}>Reviewing</h2>
                        <div className={styles.pillContainer}>
                            {reviewingData.map((item, idx) => {
                                // Clean up trailing commas and split by comma if multiple items exist (e.g. ACM Automotive UI)
                                const cleanItems = item.replace(/,$/, '').replace(/'$/, '').split(',').map(s => s.trim());
                                return cleanItems.map((cleanItem, subIdx) => {
                                    // Match letters/spaces vs numbers/apostrophes for venue and years
                                    const match = cleanItem.match(/^([A-Za-z\s]+)(.*)$/);
                                    let venue = cleanItem;
                                    let years = "";
                                    if (match) {
                                        venue = match[1].trim();
                                        years = match[2].trim();
                                    }
                                    return (
                                        <div key={`${idx}-${subIdx}`} className={styles.reviewPill}>
                                            <span className={styles.reviewVenue}>{venue}</span>
                                            {years && <span className={styles.reviewYears}>{years}</span>}
                                        </div>
                                    );
                                });
                            })}
                        </div>
                    </div>
                )}
            </div>

        </section>
    );
}

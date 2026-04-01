import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './RoadTrips.module.css';
import { roadTripsData } from '../data/roadTrips';
import { useScrollSpy } from '../hooks/useScrollSpy';

import cachedRoutesRaw from '../data/cachedRoutes.json';
const cachedRoutes = cachedRoutesRaw as unknown as Record<string, [number, number][]>;
// Custom component to dynamically recenter the map when bounded coordinates change (e.g. Next/Prev navigation)
function RecenterMap({ bounds }: { bounds: [[number, number], [number, number]] }) {
    const map = useMap();
    useEffect(() => {
        if (bounds && map) {
            // Use flyToBounds for a smooth panning animation rather than a harsh cut
            map.flyToBounds(bounds, { padding: [50, 50], duration: 0.5 });
        }
    }, [map, bounds]);
    return null;
}

export default function RoadTrips() {
    const listRef = useScrollSpy(`.${styles.item} `, styles.active);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    // Close lightbox on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedIndex(null);
            if (selectedIndex !== null) {
                if (e.key === 'ArrowRight') setSelectedIndex((selectedIndex + 1) % roadTripsData.length);
                if (e.key === 'ArrowLeft') setSelectedIndex((selectedIndex - 1 + roadTripsData.length) % roadTripsData.length);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedIndex]);

    const openLightbox = (index: number) => setSelectedIndex(index);
    const closeLightbox = () => setSelectedIndex(null);

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex + 1) % roadTripsData.length);
        }
    };

    const goToPrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedIndex !== null) {
            setSelectedIndex((selectedIndex - 1 + roadTripsData.length) % roadTripsData.length);
        }
    };

    // Calculate bounding box for a given trip's stops
    const getBounds = (trip: typeof roadTripsData[0]): [[number, number], [number, number]] => {
        const lats = trip.stops.map(s => s.coords[0]);
        const lngs = trip.stops.map(s => s.coords[1]);
        const latOffset = trip.boundsOffset ? trip.boundsOffset[0] : 0;
        const lngOffset = trip.boundsOffset ? trip.boundsOffset[1] : 0;
        return [
            [Math.min(...lats) + latOffset, Math.min(...lngs) + lngOffset],
            [Math.max(...lats) + latOffset, Math.max(...lngs) + lngOffset]
        ];
    };

    return (
        <section id="roadtrips" className={styles.section}>
            <h2 className={styles.sectionTitle}>Road Trips</h2>
            <p className="section-subtitle">
                I love driving, especially when there's beautiful things to look at. I've been meticulously logging my road trips, and here's a collection of transcontinental drives and remote expeditions. Every route is meticulously logged and mathematically traced. Happy to answer questions to any of the trips here. Enjoy!
            </p>
            <div className={styles.list} ref={listRef}>
                {roadTripsData.map((trip, idx) => (
                    <div
                        key={idx}
                        className={styles.item}
                        onClick={() => openLightbox(idx)}
                        role="button"
                        tabIndex={0}
                        aria-label={`View map of ${trip.title}`}
                    >
                        <div className={styles.thumbnailContainer}>
                            <img
                                src={`/images/roadtrips/trip-${idx}.png`}
                                alt={`Map of ${trip.title}`}
                                className={styles.thumbnailMap}
                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                            />
                        </div>
                        <div className={styles.textDetails}>
                            <h3 className={styles.tripTitle}>{trip.title}</h3>
                            <span className={styles.tripMiles}>{trip.miles.toLocaleString()} miles</span>
                            <div className={styles.stops}>
                                {trip.stops.map((stop, sIdx) => (
                                    <span key={sIdx} className={styles.stop}>
                                        {stop.name}{sIdx < trip.stops.length - 1 ? ' → ' : ''}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedIndex !== null && (
                <div className={styles.lightbox} onClick={closeLightbox}>
                    <button className={styles.closeBtn} onClick={closeLightbox} aria-label="Close map">
                        &times;
                    </button>
                    <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={goToPrev} aria-label="Previous trip">
                        &#10094;
                    </button>
                    <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={goToNext} aria-label="Next trip">
                        &#10095;
                    </button>
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.expandedMap}>
                            <MapContainer
                                bounds={getBounds(roadTripsData[selectedIndex])}
                                boundsOptions={{ padding: [50, 50] }}
                                scrollWheelZoom={true}
                                attributionControl={false}
                                className={styles.lightboxMap}
                            >
                                <RecenterMap bounds={getBounds(roadTripsData[selectedIndex])} />
                                <TileLayer
                                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                                />
                                <Polyline
                                    positions={cachedRoutes[selectedIndex]}
                                    color="#0066cc"
                                    weight={3}
                                    opacity={0.8}
                                />
                                {roadTripsData[selectedIndex].stops.map((stop, sIdx) => (
                                    <CircleMarker
                                        key={sIdx}
                                        center={stop.coords}
                                        radius={6}
                                        pathOptions={{ fillColor: '#0066cc', color: 'white', weight: 2, fillOpacity: 1 }}
                                    />
                                ))}
                            </MapContainer>
                            <div className={styles.mapDetails}>
                                <h3>{roadTripsData[selectedIndex].title}</h3>
                                <p className={styles.routeDetails}>
                                    {roadTripsData[selectedIndex].miles.toLocaleString()} total miles • {roadTripsData[selectedIndex].stops.map(s => s.name).join(' → ')}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

import { useState } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { roadTripsData } from '../data/roadTrips';
import cachedRoutesRaw from '../data/cachedRoutes.json';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix typical Leaflet marker icon issue
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

const cachedRoutes = cachedRoutesRaw as unknown as Record<string, [number, number][]>;

export default function SnapshotView({ id }: { id: number }) {
    const [ready, setReady] = useState(false);
    const trip = roadTripsData[id];
    const route = cachedRoutes[id];

    if (!trip || !route) {
        return <div style={{ color: 'white' }}>Error loading trip {id}</div>;
    }

    // Leaflet map setup
    return (
        <div style={{ width: '800px', height: '600px', background: '#000' }}>
            <MapContainer
                bounds={L.polyline(route).getBounds().pad(0.1)}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
                whenReady={() => {
                    // Small delay to ensure tiles render
                    setTimeout(() => setReady(true), 1500);
                }}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />
                
                {/* The main route line */}
                <Polyline 
                    positions={route} 
                    color="var(--accent-primary, #64ffda)" 
                    weight={4} 
                    opacity={0.8}
                />

                {/* Individual Stop Markers */}
                {trip.stops.map((stop, idx) => (
                    <Marker key={idx} position={stop.coords}>
                        <Popup>{stop.name}</Popup>
                    </Marker>
                ))}
            </MapContainer>
            
            {/* Puppeteer Hook */}
            {ready && <div id="snapshot-ready" style={{ display: 'none' }}></div>}
        </div>
    );
}

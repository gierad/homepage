import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { roadTripsData } from './roadTrips.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchRoute(trip) {
    const coordinates = trip.stops.map(stop => `${stop.coords[1]},${stop.coords[0]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson`;

    console.log(`Fetching route for ${trip.title}...`);
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch route for ${trip.title}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (data.code !== 'Ok' || !data.routes || data.routes.length === 0) {
        console.error(`OSRM error for ${trip.title}:`, data);
        throw new Error(`OSRM return code: ${data.code}`);
    }

    // Convert GeoJSON [lon, lat] back to standard Leaflet [lat, lon]
    return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
}

async function main() {
    const cachedRoutes = {};

    for (let i = 0; i < roadTripsData.length; i++) {
        const trip = roadTripsData[i];
        let route = null;
        let retries = 3;
        
        while (retries > 0) {
            try {
                route = await fetchRoute(trip);
                break;
            } catch (error) {
                console.error(`=> Error mapping ${trip.title}: ${error.message}`);
                retries--;
                if (retries > 0) {
                    console.log(`Retrying in 5 seconds... (${retries} attempts left)`);
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }
            }
        }
        
        if (!route) {
            console.error(`FATAL: Failed to map ${trip.title} after 3 retries. Aborting to prevent incomplete cache.`);
            process.exit(1);
        }

        cachedRoutes[i] = route;
        console.log(`Successfully mapped ${trip.title} with ${route.length} points.`);

        // Delay to firmly respect OSRM's 1-request-per-second public API limit
        if (i < roadTripsData.length - 1) {
            const delay = 2500;
            console.log(`Waiting ${delay}ms API cooldown...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    const outputDir = path.join(__dirname, '../src/data');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    const outputPath = path.join(outputDir, 'cachedRoutes.json');
    fs.writeFileSync(outputPath, JSON.stringify(cachedRoutes));
    console.log(`\nSuccess! Wrote complete route cache to ${outputPath}`);
}

main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});

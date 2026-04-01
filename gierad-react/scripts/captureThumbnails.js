import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { roadTripsData } from './roadTrips.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    console.log('Launching Puppeteer to generate static thumbnails...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // 800x600 at 2x scale provides a perfectly sharp 1600x1200 thumbnail
    await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 });
    
    const outputDir = path.join(__dirname, '../public/images/roadtrips');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    for (let i = 0; i < roadTripsData.length; i++) {
        const trip = roadTripsData[i];
        console.log(`Processing trip [${i}]: ${trip.title}`);
        
        try {
            await page.goto(`http://127.0.0.1:5174/?snapshot=${i}`, { waitUntil: 'networkidle0' });
            
            // Wait for our custom ready hook from SnapshotView
            await page.waitForSelector('#snapshot-ready', { timeout: 10000 });
            
            // Wait an extra 800ms precisely to guarantee WebGL tile layering artifacts map properly
            await new Promise(r => setTimeout(r, 800));
            
            const filename = `trip-${i}.png`;
            const filepath = path.join(outputDir, filename);
            
            await page.screenshot({ path: filepath });
            console.log(`Successfully saved screenshot: ${filename}`);
            
        } catch (error) {
            console.error(`=> Failed to snapshot trip [${i}]: ${trip.title}`, error);
        }
    }
    
    await browser.close();
    console.log('\nFinished generating all headless thumbnails!');
}

main().catch(err => {
    console.error('Fatal error in snapshot script:', err);
    process.exit(1);
});

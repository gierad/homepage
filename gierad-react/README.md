# Gierad's Personal Portfolio (React + Vite)

This repository contains the source code for my personal portfolio, built with React, TypeScript, and Vite. The design language is strictly minimalist, favoring monochrome aesthetics, sharp typography, and carefully curated photography.

## Project Architecture & Data Management

The application is heavily data-driven, storing content in static TypeScript/JSON files rather than relying on an external CMS. This ensures blazing fast load times and version-controlled content history.

- `src/data/cv.ts`: Master configuration for biography, experience, education, and publication data.
- `src/data/roadTrips.ts` & `scripts/roadTrips.js`: The central arrays defining all road trip stops (latitude/longitude), distances, and metadata.
- `src/data/gallery.json`: The manifest for the "Passengers" photography collection.

## Key Features & Custom Implementations

### 1. "Already Immortal" Photography Collection
The photography section serves as a meditation on the fleeting nature of human time versus geological time, deeply influenced by the U.S. National Parks. 
- **Typography:** Features a highly stylized, italicized excerpt from John Muir's journals (Yosemite, 1875) rendered in `Playfair Display`.
- **Masonry Grid:** A strict, static black-and-white grid without zoom hover effects to emulate a physical fine-art gallery wall. Key images (like the volcano eruption) are algorithmically anchored to the end of the collection for narrative pacing.

### 2. Road Trips & Headless Map Generation
The "Road Trips" section documents 30+ journeys (including recent additions like Mallorca and Menorca).
- **Route Fetching (`fetchRoutes.js`):** A custom Node script that queries the public OSRM (Open Source Routing Machine) API to calculate the exact turn-by-turn driving polylines between all stops. This data is cached in `cachedRoutes.json`.
- **Thumbnail Capture (`captureThumbnails.js`):** We use a Puppeteer headless browser to silently spin up the app (`?snapshot=ID`), render the dark-mode Leaflet map with the blue route polyline, and capture perfectly framed `1600x1200` PNG thumbnails into the `public/images/roadtrips/` directory.

### 3. "PERSONAL" Fractured Typography
The portfolio heavily leverages CSS `clip-path` and `translate` properties to create "fractured" or "fault-line" typographic effects, specifically on the "PERSONAL" section header. 
- The word is split exactly in half horizontally using `::before` (top) and `::after` (bottom) pseudo-elements. 
- The bottom halves of P, E, R, S are shifted to the right (`translateX`), while the bottom halves of N, A, L are shifted to the left (negative `translateX`) to create visual tension pulling away from the central "O".

### 4. Book UI Experiment (Archived)
An experimental UI implementation using `react-pageflip` to emulate a physical digital monograph was developed but ultimately archived in favor of the clean lightbox approach. The original experimental code is preserved for future reference in `src/experiments/BookUI/`.

## Development Commands

```bash
# Start the local development server
npm run dev

# Update the OSRM route cache for newly added road trips
node scripts/fetchRoutes.js

# Regenerate map thumbnails for all road trips
# (Requires the dev server to be running on port 5174 locally)
node scripts/captureThumbnails.js
```

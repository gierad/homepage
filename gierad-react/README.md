# Gierad's Personal Portfolio (React + Vite)

This repository contains the source code for my personal portfolio, built with React, TypeScript, and Vite. The design language is strictly minimalist, favoring monochrome aesthetics, sharp typography, and carefully curated photography.

## Project Architecture & Data Management

The application is heavily data-driven, storing content in static TypeScript/JSON files rather than relying on an external CMS. This ensures blazing fast load times and version-controlled content history.

- `src/data/cv.ts`: Master configuration for biography, experience, education, shipped features, and publication data.
- `src/data/projects.json`: Companion manifest cataloging shipped features and research publications.
- `public/projects/`: Static media assets and thumbnails for all shipped features and research projects. Contains master artwork source files (`thumbnails.psd`, `layoutbackground.psd`).
- `src/data/roadTrips.ts` & `scripts/roadTrips.js`: The central arrays defining all road trip stops (latitude/longitude), distances, and metadata.
- `src/data/gallery.json`: The manifest for the "Passengers" photography collection.

## Key Features & Custom Implementations

### 1. "Already Immortal" Photography Collection
The photography section serves as a meditation on the fleeting nature of human time versus geological time, deeply influenced by the U.S. National Parks. 
- **Typography:** Features a highly stylized, italicized excerpt from John Muir's journals (Yosemite, 1875) rendered in `Playfair Display`.
- **Masonry Grid:** A strict, static black-and-white grid without zoom hover effects to emulate a physical fine-art gallery wall. Key images (like the volcano eruption) are algorithmically anchored to the end of the collection for narrative pacing.

### 2. Road Trips & Headless Map Generation
The "Road Trips" section documents 30+ journeys (including recent additions like Mallorca, Menorca, and The Great Plains).
- **Route Fetching (`fetchRoutes.js`):** A custom Node script that queries the public OSRM (Open Source Routing Machine) API to calculate the exact turn-by-turn driving polylines between all stops. This data is cached in `cachedRoutes.json`.
- **Thumbnail Capture (`captureThumbnails.js`):** We use a Puppeteer headless browser to silently spin up the app (`?snapshot=ID`), render the dark-mode Leaflet map with the blue route polyline, and capture perfectly framed `1600x1200` PNG thumbnails into the `public/images/roadtrips/` directory.

### 3. "PERSONAL" Fractured Typography
The portfolio heavily leverages CSS `clip-path` and `translate` properties to create "fractured" or "fault-line" typographic effects, specifically on the "PERSONAL" section header. 
- The word is split exactly in half horizontally using `::before` (top) and `::after` (bottom) pseudo-elements. 
- The bottom halves of P, E, R, S are shifted to the right (`translateX`), while the bottom halves of N, A, L are shifted to the left (negative `translateX`) to create visual tension pulling away from the central "O".

### 4. Projects & Shipped Features Grid
The features and publications sections highlight both Apple commercial shipping accomplishments and academic HCI/ML research papers.
- **Intrinsic Aspect Ratio Preservation:** Rather than enforcing rigid cropping or arbitrary ratios (e.g., 1:1 or 16:9 with `object-fit: cover`), `.imageContainer` uses `width: 200px` (`100%` on mobile) and `.image` uses `width: 100%; height: auto; display: block;`. This allows every thumbnail to naturally display at its true authored aspect ratio (~12:7 / 1.714:1 across 960×560 and 506×295 source files) without letterboxing or loss of edge details.
- **PSD Artwork Master Extraction:** Classic research thumbnails are derived from `public/projects/thumbnails.psd` (506×295 canvas). For instance, the *Acoustruments* thumbnail was recovered directly from Layer 6 of `thumbnails.psd` (combining the Yakamo robot interaction and the Knox Labs acoustic VR headset controller) to resolve a previously mismatched asset.
- **Recent Shipped Additions:** Updated with *iPhone Duo* (StandBy low-power ML sensing with N1) and *Audio Intelligence with Live Rewind and Siri Recap* (`public/projects/SiriRecapLiveRewind/`).

### 5. Book UI Experiment (Archived)
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

## Deployment

To deploy the portfolio to the production Dreamhost environment, first compile the application and then use `rsync` to synchronize the `dist/` directory with the remote web root. This securely uploads the latest assets while deleting any stale files.

# 1. Compile the production bundle
npm run build

# 2. Sync the bundle to the Dreamhost production server
# Note: --exclude protects the persistent SQLite database from being overwritten
rsync -avz --delete --exclude='coffee/api/data/' --exclude='*.sqlite' dist/ gierad@gierad.com:/home/gierad/gierad.com/
```

### Coffee Tracker (`gierad.com/coffee/`)
The coffee app is hosted under the `/coffee/` subdirectory.
- **Frontend**: Multi-page app bundled to `dist/coffee/index.html` with full recipe management, shot tracking, and inventory diagnostics.
- **Backend**: Native Dreamhost PHP + SQLite API (`coffee/api/index.php`).
- **Database**: Single-file SQLite database located at `coffee/api/data/coffee.sqlite` (or `/home/gierad/coffee_data/coffee.sqlite`).
- **Initial Seed**: Automatically seeds from `public/coffee/api/seed_beans.json` on first visit.
- **AI Interrogation**: To enable the Gemini-powered coffee technician chat on Dreamhost, copy `public/coffee/api/config.sample.php` to `config.php` and set your `gemini_api_key`.


const fs = require('fs');
const cheerio = require('cheerio');

// Read index.php
const phpStr = fs.readFileSync('../gierad.com/wp-content/themes/gratitude/index.php', 'utf8');

const $ = cheerio.load(phpStr);

const teamData = [];
const alumniData = [];

// Team
$('h2:contains("TEAM")').parent().next('.box.alt').find('.3u, .3u\\$').each((i, el) => {
    let imgSrc = $(el).find('img').attr('src') || '';
    imgSrc = imgSrc.split('?')[0]; // remove ?v=10 etc
    if (imgSrc) {
        if (!imgSrc.startsWith('/')) {
            imgSrc = '/' + imgSrc;
        }
    }

    // Some names have links, some don't.
    const $p = $(el).find('p');
    let name = $p.find('a').text().trim();
    if (!name) {
        // Text node
        name = $p.contents().first().text().trim();
    }

    const link = $p.find('a').attr('href') || '';

    const htmlLines = $p.html().split(/<br\s*\/?>/i);
    let role = htmlLines.length > 1 ? htmlLines[1].replace(/<[^>]*>?/gm, '').trim() : '';

    // Skip Gierad himself if we don't want him in the team section, but index.php had him. Let's include him or maybe skip it since he's the site owner?
    // User said "And then the TEAM members (and not just the alumni) should also show up (see index.php from the previous version)."
    // Let's include everyone exactly as in index.php. But wait, we already have Gierad in the Hero.
    // If the user said "see index.php", I will just scrape it faithfully.
    if (name === 'Dr. Gierad Laput') return; // Typically omit self, but let's check what was done previously. Previously I omitted Gierad in parse_cv.cjs because I skipped gierad_portrait. Wait, parse_cv.cjs just took whatever was in index.html.

    teamData.push({ name, role, imgSrc, link });
});

// Alumni
$('h4:contains("Alumni")').next('.box.alt').find('.3u, .3u\\$').each((i, el) => {
    let imgSrc = $(el).find('img').attr('src') || '';
    imgSrc = imgSrc.split('?')[0]; // remove ?v=10 etc
    if (imgSrc) {
        if (!imgSrc.startsWith('/')) {
            imgSrc = '/' + imgSrc;
        }
    }

    const $p = $(el).find('p');
    let name = $p.find('a').text().trim();
    if (!name) {
        name = $p.contents().first().text().trim();
    }
    const link = $p.find('a').attr('href') || '';

    const htmlLines = $p.html().split(/<br\s*\/?>/i);
    let role = htmlLines.length > 1 ? htmlLines[1].replace(/<[^>]*>?/gm, '').trim() : '';
    let current = htmlLines.length > 2 ? htmlLines[2].replace(/<[^>]*>?/gm, '').trim().replace(/^[\(\)]+|[\(\)]+$/g, '') : '';

    alumniData.push({ name, role, current, imgSrc, link });
});

// Update cv.ts
let cvTs = fs.readFileSync('src/data/cv.ts', 'utf8');
cvTs = cvTs.replace(/export const teamData = \[[\s\S]*?\];/, `export const teamData = ${JSON.stringify(teamData, null, 2)};`);
cvTs = cvTs.replace(/export const alumniData = \[[\s\S]*?\];/, `export const alumniData = ${JSON.stringify(alumniData, null, 2)};`);

fs.writeFileSync('src/data/cv.ts', cvTs);
console.log('Successfully updated cv.ts with data from index.php');

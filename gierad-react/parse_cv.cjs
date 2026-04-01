const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('../gierad-v2/index.html', 'utf8');
const $ = cheerio.load(html);

const data = {
    team: [],
    alumni: [],
    features: [],
    service: [],
    talks: [],
    teaching: [],
    reviewing: [],
    press: [],
};

// Team
$('h2:contains("TEAM")').nextAll('.box.alt').first().find('.3u, .3u\\$').each((i, el) => {
    const imgSrc = $(el).find('img').attr('src');
    const name = $(el).find('.team-font').find('a').text() || $(el).find('.team-font').contents().first().text().trim();
    const link = $(el).find('a').attr('href') || '';
    const contents = $(el).find('.team-font').html();
    if (!contents) return;
    const parts = contents.split('<br>');
    const role = parts.length > 1 ? parts[1].replace(/<[^>]*>?/gm, '').trim() : '';
    data.team.push({ name, role, imgSrc: imgSrc ? imgSrc.replace('images/', '/') : '', link });
});

// Alumni
$('h4:contains("Alumni")').next('.box.alt').find('.3u, .3u\\$').each((i, el) => {
    const imgSrc = $(el).find('img').attr('src');
    const $p = $(el).find('p');
    const name = $p.find('a').text() || $p.contents().first().text().trim();
    const link = $p.find('a').attr('href') || '';
    const contents = $p.html();
    if (!contents) return;
    const parts = contents.split('<br>');
    const role = parts.length > 1 ? parts[1].replace(/<[^>]*>?/gm, '').trim() : '';
    const current = parts.length > 2 ? parts[2].replace(/<[^>]*>?/gm, '').trim().replace(/[\(\)]/g, '') : '';
    data.alumni.push({ name, role, current, imgSrc: imgSrc ? imgSrc.replace('images/', '/') : '', link });
});

// Features Shipped
$('.shipped article').each((i, el) => {
    const imgSrc = $(el).find('img').attr('src');
    const title = $(el).find('h3.major').text().trim();
    const link = $(el).find('h3.major a').attr('href') || '';
    const description = $(el).find('.article-info p').text().trim();
    if (title) {
        data.features.push({ title, description, link, imgSrc: imgSrc ? imgSrc.replace('projects/', '/') : '' });
    }
});

// Extract simple lists
function extractList(headerText, prop) {
    const $p = $(`h2.majorpad:contains("${headerText}")`).next('p');
    const htmlStr = $p.html();
    if (!htmlStr) return;
    const items = htmlStr.split('<br>').map(s => s.trim()).filter(s => s.length > 0);
    items.forEach(item => {
        // Basic innerText extraction
        const cleanText = item.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
        if (cleanText) data[prop].push(cleanText);
    });
}

extractList('ACADEMIC SERVICE', 'service');
extractList('INVITED TALKS', 'talks');
extractList('TEACHING', 'teaching');
extractList('Reviewing', 'reviewing');

// Better Press extraction
const pressHtml = $('h2.majorpad:contains("SELECTED PRESS")').next('p').html();
if (pressHtml) {
    const pressItems = pressHtml.split('<br>').map(s => s.trim()).filter(s => s.length > 0);
    pressItems.forEach(item => {
        const $item = cheerio.load('<span>' + item + '</span>');
        const pub = $item('em').text();
        const link = $item('a').attr('href') || '';
        const title = $item('a').text() || '';
        const yearMatch = item.match(/^(\d{4})/);
        const year = yearMatch ? yearMatch[1] : '';
        if (title || pub) {
            data.press.push({ year, publication: pub, title, link });
        }
    });
}

fs.writeFileSync('src/data/cv2.json', JSON.stringify(data, null, 2));
console.log('Extraction complete.');

const fs = require('fs');
let text = fs.readFileSync('src/data/cv.ts', 'utf8');

text = text.replace(/"imgSrc": "\/team\//g, '"imgSrc": "/images/team/');
text = text.replace(/"imgSrc": "\/([A-Za-z0-9_-]+)\/(.+?\.jpg)"/g, (match, p1, p2) => {
    if (p1 === 'images' || p1 === 'projects') return match;
    return `"imgSrc": "/projects/${p1}/${p2}"`;
});

fs.writeFileSync('src/data/cv.ts', text);
console.log('Done');

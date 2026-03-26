const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

// We are looking for lines like:
// <img src="https://gierad.com/images/travel/borabora_01_lowres.jpg" high-res="https://gierad.com/images/travel/borabora_01_highres.jpg" w="1080" h="720" alt="Bora Bora, French Polynesia">
const regex = /<img[\s\S]*?high-res="([^"]+)"[\s\S]*?w="(\d+)"[\s\S]*?h="(\d+)"[\s\S]*?alt="([^"]+)"/g;

let match;
const photos = [];

while ((match = regex.exec(html)) !== null) {
    let lowResMatch = html.substring(match.index - 100, match.index).match(/src="([^"]+)"/);
    let lowRes = lowResMatch ? lowResMatch[1] : match[1];

    // ensure relative path mapping to our public folder architecture
    lowRes = lowRes.replace('https://gierad.com/', '/');
    let highRes = match[1].replace('https://gierad.com/', '/');

    photos.push({
        src: lowRes,
        highRes: highRes,
        width: parseInt(match[2]),
        height: parseInt(match[3]),
        title: match[4],
    });
}

console.log(JSON.stringify(photos, null, 2));

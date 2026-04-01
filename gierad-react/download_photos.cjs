const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        }, (response) => {
            // follow common redirects
            if ([301, 302, 307, 308].includes(response.statusCode)) {
                return download(response.headers.location, dest).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
                return;
            }

            const file = fs.createWriteStream(dest);
            response.pipe(file);
            file.on('finish', () => { file.close(resolve); });
        }).on('error', err => { fs.unlink(dest, () => { }); reject(err); });
    });
};

const cvPath = path.join(__dirname, 'src', 'data', 'cv.ts');
const cvContent = fs.readFileSync(cvPath, 'utf8');

// Match all references to travel imagery
const regex = /\/images\/travel\/([^"]+)/g;
let match;
const urls = new Set();
while ((match = regex.exec(cvContent)) !== null) {
    if (match[1].endsWith('.jpg') || match[1].endsWith('.png')) {
        urls.add(match[1]);
    }
}

const targetDir = path.join(__dirname, 'public', 'images', 'travel');
if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
}

async function main() {
    const total = urls.size;
    let count = 0;
    console.log(`Found ${total} unique images to download.`);

    // Download 5 at a time concurrently
    const chunks = [];
    const urlArray = Array.from(urls);
    for (let i = 0; i < urlArray.length; i += 5) {
        chunks.push(urlArray.slice(i, i + 5));
    }

    for (const chunk of chunks) {
        await Promise.all(chunk.map(async (filename) => {
            const dest = path.join(targetDir, filename);
            if (!fs.existsSync(dest)) {
                const url = `https://gierad.com/images/travel/${filename}`;
                try {
                    await download(url, dest);
                    count++;
                    console.log(`[${count}/${total}] Saved ${filename}`);
                } catch (e) {
                    console.error(`Error downloading ${filename}: ${e.message}`);
                }
            } else {
                count++;
                console.log(`[${count}/${total}] ${filename} already exists.`);
            }
        }));
    }
    console.log("Download complete.");
}

main();

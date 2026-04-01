const fs = require('fs');
const https = require('https');
const path = require('path');

const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
        }, (response) => {
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

async function main() {
    const lightUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Disney_wordmark.svg/512px-Disney_wordmark.svg.png';
    const darkUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney_wordmark_%28white%29.svg/512px-Disney_wordmark_%28white%29.svg.png';

    const targetDir = path.join(__dirname, 'public', 'images', 'logos');

    console.log("Downloading Light Mode Disney Wordmark...");
    await download(lightUrl, path.join(targetDir, 'disney_wordmark.png'));

    console.log("Downloading Dark Mode Disney Wordmark...");
    await download(darkUrl, path.join(targetDir, 'disney_wordmark_dark.png'));

    console.log("Done.");
}

main();

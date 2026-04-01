const https = require('https');
const fs = require('fs');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (response) => {
      // follow redirects
      if (response.statusCode === 301 || response.statusCode === 302 || response.statusCode === 307 || response.statusCode === 308) {
        return download(response.headers.location, dest).then(resolve).catch(reject);
      }
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      const file = fs.createWriteStream(dest);
      response.pipe(file);
      file.on('finish', () => { file.close(resolve); });
    }).on('error', err => { fs.unlink(dest, () => {}); reject(err); });
  });
};

async function run() {
    try {
        // Red CMU Square Wordmark
        await download("https://www.cmu.edu/brand/brand-guidelines/images/cmu-wordmark-square-red.png", "public/images/logos/cmu.png");
        console.log("CMU Square Wordmark done");
        // Block-M Michigan
        await download("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Michigan_Block_M.svg/512px-Michigan_Block_M.svg.png", "public/images/logos/michigan.png");
        console.log("Michigan Block M done");
        // Harvard
        await download("https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Harvard_shield_wreath.svg/512px-Harvard_shield_wreath.svg.png", "public/images/logos/harvard.png");
        console.log("Harvard done");

    } catch(e) { console.error(e); }
}
run();

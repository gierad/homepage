const https = require('https');
const fs = require('fs');

const download = (url, dest) => {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      // follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
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
        // Logotype CMU
        await download("https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Carnegie_Mellon_University_wordmark.svg/512px-Carnegie_Mellon_University_wordmark.svg.png", "public/images/logos/cmu.png");
        console.log("CMU logotype done");
        // Block-M Michigan
        await download("https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Michigan_Block_M.svg/512px-Michigan_Block_M.svg.png", "public/images/logos/michigan.png");
        console.log("Michigan Block M done");
    } catch(e) { console.error(e); }
}
run();

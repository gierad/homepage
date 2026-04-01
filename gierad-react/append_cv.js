const fs = require('fs');
const cv2 = JSON.parse(fs.readFileSync('src/data/cv2.json', 'utf8'));

let appendStr = '\n\n// Restored data from gierad-v2 HTML\n';

for (const key in cv2) {
    appendStr += `export const ${key}Data = ${JSON.stringify(cv2[key], null, 2)};\n\n`;
}

fs.appendFileSync('src/data/cv.ts', appendStr);
console.log('Appended to cv.ts');

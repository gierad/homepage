const fs = require('fs');

let cv = fs.readFileSync('src/data/cv.ts', 'utf8');

const pubUpdates = [
    { title: "Gesture Customization", imgSrc: "/projects/GestureCustomization/thumbnail.jpg" },
    { title: "Listen Learner", imgSrc: "/projects/ListenLearner/thumbnail.jpg" },
    { title: "Hand Activities", imgSrc: "/projects/HandActivities/thumbnail.jpg" },
    { title: "ViBand", imgSrc: "/projects/ViBand/thumbnail.jpg" },
    { title: "EM-Sense", imgSrc: "/projects/EMSense/thumbnail.jpg" },
    { title: "SkinTrack", imgSrc: "/projects/SkinTrack/thumbnail.jpg" },
    { title: "Synthetic Sensors", imgSrc: "/projects/SuperSensor/thumbnail.jpg" }
];

let parsed = false;

pubUpdates.forEach(update => {
    const regex = new RegExp(`(title:\\s*"${update.title}",\\s*description:\\s*"[^"]*",\\s*link:\\s*"[^"]*")`);
    cv = cv.replace(regex, `$1,\n    imgSrc: "${update.imgSrc}"`);
});

fs.writeFileSync('src/data/cv.ts', cv);
console.log('Added imgSrc to publicationsData');

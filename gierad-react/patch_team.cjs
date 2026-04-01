const fs = require('fs');

const currentTeam = [
    { name: "Dr. James Kennedy", role: "Senior Research Scientist", imgSrc: "james.jpg", link: "" },
    { name: "Richard Kang", role: "Senior ML Engineer", imgSrc: "richard.jpg", link: "http://runchangkang.com" },
    { name: "Dr. Kareem Bedri", role: "Research and Engineering Manager", imgSrc: "kareem.jpg", link: "https://sites.google.com/view/abdelkareembedri" },
    { name: "Erik Hornberger", role: "Senior Software Engineer", imgSrc: "erik.jpg", link: "" },
    { name: "George Haddad", role: "Software Engineering Manager", imgSrc: "george.jpg", link: "" },
    { name: "Dr. Asaf Liberman", role: "Senior Research Scientist", imgSrc: "asaf.jpg", link: "" },
    { name: "Baruch Zilber", role: "Senior Software Engineer", imgSrc: "mike.jpg", link: "" },
    { name: "Saar Tal Mirkin", role: "Senior ML Engineer", imgSrc: "mike.jpg", link: "" },
    { name: "Mike Ralph", role: "Software Engineer", imgSrc: "mike.jpg", link: "" },
    { name: "Shira Kadosh", role: "ML Engineer", imgSrc: "shira.jpg", link: "" },
    { name: "Oron Levy", role: "Senior Research Scientist", imgSrc: "oron.jpg", link: "" },
    { name: "Dr. Daniel Rotman", role: "Senior Research Scientist", imgSrc: "daniel.jpg", link: "" },
    { name: "Eyal Finkelshtein", role: "ML Engineer", imgSrc: "eyal.jpg", link: "" },
    { name: "Moran Yanuka", role: "Research Associate", imgSrc: "moran.jpg", link: "" },
    { name: "Dr. Rebecca Adaimi", role: "Research Scientist", imgSrc: "rebecca.jpg", link: "https://www.rebeccaadaimi.com" },
    { name: "Junyoung Park", role: "Research Associate", imgSrc: "junyong.jpg", link: "https://junyong.xyz" },
    { name: "Mary Vo", role: "Data and Test Engineer", imgSrc: "mike.jpg", link: "" },
    { name: "Cathy Fang", role: "Research Associate", imgSrc: "cathy.jpg", link: "https://cathy-fang.com/about.html", current: "(Currently Ph.D. at MIT)" },
    { name: "Arkady Godlin", role: "Senior ML Engineer", imgSrc: "mike.jpg", link: "" },
    { name: "Richie Muffoleto", role: "Senior ML SWE", imgSrc: "mike.jpg", link: "" },
    { name: "Steve Berardi", "role": "Senior ML SWE", imgSrc: "mike.jpg", link: "" },
    { name: "Joachim Stahl", "role": "Senior ML SWE", imgSrc: "mike.jpg", link: "" },
    { name: "Mohamed Hussain", "role": "ML Research Engineer", imgSrc: "mike.jpg", link: "" },
    { name: "Anurag Bansal", "role": "Senior ML Engineer", imgSrc: "mike.jpg", link: "" },
    { name: "Yanzi Jin", "role": "Senior ML Researcher", imgSrc: "mike.jpg", link: "" },
    { name: "Jackson Cannon", "role": "ML Engineer", imgSrc: "mike.jpg", link: "" },
    { name: "Todd Ferkingstad", "role": "Data Ops Manager", imgSrc: "mike.jpg", link: "" },
    { name: "Brian Kinnee", "role": "Data Ops", imgSrc: "mike.jpg", link: "" },
    { name: "Michelle Nugyen", "role": "Data Ops", imgSrc: "mike.jpg", link: "" }
];

function resolveImg(baseName) {
    if (fs.existsSync(`public/images/team/${baseName}`)) {
        return `/images/team/${baseName}`;
    }
    return `/images/team/bw/${baseName}`;
}

const resolvedTeam = currentTeam.map(t => ({ ...t, imgSrc: resolveImg(t.imgSrc) }));

let cv = fs.readFileSync('src/data/cv.ts', 'utf8');

// Replace export const teamData = []; with actual
cv = cv.replace(/export const teamData = \[\];/, `export const teamData = ${JSON.stringify(resolvedTeam, null, 2)};`);

// Also fix alumni data to use saturated images if they exist
cv = cv.replace(/"imgSrc": "\/images\/team\/bw\/(.+?)"/g, (match, p1) => {
    return `"imgSrc": "${resolveImg(p1)}"`;
});

fs.writeFileSync('src/data/cv.ts', cv);
console.log('Fixed team data and images.');

const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');

const seedPath = path.resolve(__dirname, '../public/coffee/api/seed_beans.json');
const dataDir = path.resolve(__dirname, '../public/coffee/api/data');
const dbPath = path.join(dataDir, 'coffee.sqlite');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Add .htaccess to data dir to prevent web access
fs.writeFileSync(path.join(dataDir, '.htaccess'), 'Deny from all\n');

console.log('Seeding SQLite database at:', dbPath);

const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS beans (
    name TEXT PRIMARY KEY,
    data TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

const rawJson = fs.readFileSync(seedPath, 'utf8');
const seedData = JSON.parse(rawJson);

const insertStmt = db.prepare('INSERT OR REPLACE INTO beans (name, data) VALUES (?, ?)');

let count = 0;
for (const [name, bean] of Object.entries(seedData)) {
  insertStmt.run(name, JSON.stringify(bean));
  count++;
}

console.log(`Successfully seeded ${count} coffee bean profiles into SQLite!`);

const queryStmt = db.prepare('SELECT name, updated_at FROM beans');
const rows = queryStmt.all();
console.table(rows);

db.close();

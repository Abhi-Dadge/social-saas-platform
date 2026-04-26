const Database = require("better-sqlite3");
const path = require("path");

// 📁 Ensure DB file is created in correct location
const dbPath = path.join(__dirname, "database.sqlite");

// 🔌 Create connection
const db = new Database(dbPath);

// ⚡ Performance + Safety
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// 🏗 Create tables
db.exec(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    status TEXT NOT NULL,
    scheduled_at TEXT,
    created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS platforms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE
);

CREATE TABLE IF NOT EXISTS post_platforms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    platform TEXT,
    status TEXT,
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    platform TEXT,
    message TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY(post_id) REFERENCES posts(id) ON DELETE CASCADE
);
`);

// 🌱 Optional: Seed default platforms (safe insert)
const platforms = ["twitter", "linkedin", "instagram"];
platforms.forEach(name => {
    db.prepare(`
        INSERT OR IGNORE INTO platforms (name)
        VALUES (?)
    `).run(name);
});

console.log("✅ Database connected & tables ready");

module.exports = db;
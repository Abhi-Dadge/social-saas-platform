const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.sqlite");

// Create tables
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT,
            status TEXT,
            scheduled_at TEXT,
            created_at TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS platforms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT
        )
    `);

    db.run(`
    CREATE TABLE IF NOT EXISTS logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        post_id INTEGER,
        platform TEXT,
        message TEXT,
        created_at TEXT
    )
`);

    db.run(`
        CREATE TABLE IF NOT EXISTS post_platforms (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER,
            platform TEXT,
            status TEXT
        )
    `);
});

module.exports = db;
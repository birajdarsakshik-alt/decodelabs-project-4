const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.join(__dirname, "students.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("SQLite database connected successfully");
  }
});

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      course TEXT NOT NULL,
      year TEXT NOT NULL CHECK(year IN ('FY', 'SY', 'TY')),
      skills TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error("Table creation failed:", err.message);
    } else {
      console.log("Students table ready");
    }
  });
});

module.exports = db;

import fs from "fs";
import { exit } from "process";
import sqlite3 from "sqlite3";

sqlite3.verbose();

// Create an SQLite database connection
let db = new sqlite3.Database(
  "./backend/escroguard.sqlite",
  sqlite3.OPEN_READWRITE,
  (err: any) => {
    if (err && err.code == "SQLITE_CANTOPEN") {
      createDatabase();
      return;
    } else if (err) {
      console.log("Getting error " + err);
      exit(1);
    }
  }
);

function createDatabase() {
  var db = new sqlite3.Database("./backend/escroguard.sqlite", (err: any) => {
    if (err) {
      console.log("Getting error " + err);
      exit(1);
    }
    createTables(db);
  });
}

function createTables(db: sqlite3.Database) {
  // Read the SQL file
  const sqlFilePath = "./backend/initialize.sql";
  const sql = fs.readFileSync(sqlFilePath, "utf-8");

  db.exec(sql, () => {
    console.log("Created tables");
  });
}

export default db;

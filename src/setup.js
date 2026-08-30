const { getDb } = require('./db');

async function setup() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT);
    CREATE TABLE IF NOT EXISTS projects (id INTEGER PRIMARY KEY, name TEXT);
    CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, title TEXT, status TEXT, project_id INTEGER);
  `);
  console.log("Database created! taskdb.sqlite file is ready");
}
setup();
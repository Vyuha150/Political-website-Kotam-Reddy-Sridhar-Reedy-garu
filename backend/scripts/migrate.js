require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { pool } = require("../db");

const MIGRATIONS_DIR = path.join(__dirname, "..", "migrations");

async function main() {
  await pool.query(`
    create table if not exists _migrations (
      name text primary key,
      applied_at timestamptz not null default now()
    )
  `);

  const files = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  const applied = new Set(
    (await pool.query("select name from _migrations")).rows.map((r) => r.name)
  );

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`skip (already applied): ${file}`);
      continue;
    }
    console.log(`applying: ${file}`);
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
    await pool.query("begin");
    try {
      await pool.query(sql);
      await pool.query("insert into _migrations (name) values ($1)", [file]);
      await pool.query("commit");
    } catch (err) {
      await pool.query("rollback");
      throw err;
    }
  }

  console.log("Migrations up to date.");
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

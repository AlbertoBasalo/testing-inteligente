// Resets the back database to an empty schema: deletes the file and applies all migrations.
// Stop the servers first. Usage: node scripts/reset.mjs
import { rmSync } from "node:fs";
import { readSettings } from "../projects/back/src/core/settings.ts";
import { openDatabase } from "../projects/back/src/core/database.ts";

const { databasePath } = readSettings();

function deleteDatabaseFiles(path) {
  for (const suffix of ["", "-wal", "-shm", "-journal"]) {
    rmSync(path + suffix, { force: true });
  }
}

try {
  deleteDatabaseFiles(databasePath);
} catch (error) {
  console.error(`Cannot delete ${databasePath}. Stop the servers and try again.`);
  console.error(error.message);
  process.exit(1);
}

const database = openDatabase(databasePath);
const versions = database.prepare("SELECT version FROM schema_versions ORDER BY version").all();
database.close();

console.log(`Database reset: ${databasePath}`);
console.log(`Migrations applied: ${versions.map((row) => row.version).join(", ")}`);

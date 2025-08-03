import { drizzle } from "drizzle-orm/postgres-js";

const connString = process.env.DATABASE_URL;
if (!connString) {
    throw new Error("Environment variable DATABASE_URL was not set");
}

const db = drizzle(connString);
type Database = typeof db;

export default db;
export { type Database };

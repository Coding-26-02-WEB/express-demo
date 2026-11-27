import pg from "pg";

let pool: pg.Pool | undefined;

export function getPool(): pg.Pool {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error("DATABASE_URL is not set.");
    }
    pool ??= new pg.Pool({ connectionString });
    return pool;
}

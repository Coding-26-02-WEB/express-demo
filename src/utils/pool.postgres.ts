import { Pool } from "pg";
import "dotenv/config";

let pool: Pool | null = null;

export default function getPostgresPool(): Pool {
    if (!pool) {
        pool = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            max: 10,
        })
        // Bricht eine Idle-Verbindung ab (z. B. DB-Neustart), wirft der Pool ein "error"-Event.
        // Ohne Listener würde Node den ganzen Prozess beenden.
        pool.on("error", (err) => console.error("Postgres pool error:", err.message));
    }
    return pool;
}
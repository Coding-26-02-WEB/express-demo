import { Pool, types } from "pg";
import "dotenv/config";

// DATE-Spalten als String ("1937-09-21") statt als JS-Date zurückgeben.
// Sonst wird das Datum in lokaler Zeit erzeugt und im JSON nach UTC verschoben (-> ein Tag zu früh).
types.setTypeParser(types.builtins.DATE, (value) => value);

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
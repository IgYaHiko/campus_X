import mysql from "mysql2/promise";
import { env } from "./env";
import { logger } from "./logger";

export const pool = mysql.createPool({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: "Z",
    dateStrings: false,
    enableKeepAlive: true,
});

export async function pingDB(): Promise<boolean> {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    conn.release();
    return true;
  } catch (err) {
    logger.error({ err }, "❌ MySQL ping failed");
    return false;
  }
}


// gracefull shutdown 
export async function closeDB(): Promise<void> {
    await pool.end();
    logger.info("MySQL pool closed");
}

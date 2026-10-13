import { drizzle } from "drizzle-orm/mysql2";
import { pool } from "../config/db";
/* import * as schema from "./schema";
 */
export const db = drizzle(pool, {
  mode: "default",
});
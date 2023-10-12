import { createPool } from "mariadb"

import { config } from "dotenv"
config();

export const pool = createPool({
    user: process.env.DB_USER,
    password:  process.env.DB_PASSWORD,
    host:  process.env.DB_HOST,
    database:  process.env.DB_DATABASE,
});
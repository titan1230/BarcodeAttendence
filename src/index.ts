import { config } from 'dotenv';
import { createApp } from './utils/createApp';
import { pool } from './client/database';

config();

const PORT = process.env.PORT || 3001;

async function main() {
    try {
        const app = createApp();
        app.listen(PORT, () => console.log(`Running on Port ${PORT}`));

        pool.getConnection().then(async (con) => {
            console.log("CONNECTED TO DB");
            await con.release();
        })
    } catch (err) {
        console.log(err);
    }
}

main();
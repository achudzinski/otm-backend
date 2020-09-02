
import * as dotenv from "dotenv";
dotenv.config();

export default {
    db: {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    },
    testDb: {
        host: process.env.TEST_DB_HOST,
        port: parseInt(process.env.TEST_DB_PORT),
        username: process.env.TEST_DB_USERNAME,
        password: process.env.TEST_DB_PASSWORD,
        database: process.env.TEST_DB_NAME,
    }
}

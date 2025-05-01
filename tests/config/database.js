require('dotenv').config();

module.exports = {
    test: {
        username: process.env.DB_TEST_USER,
        password: process.env.DB_TEST_PASSWORD,
        database: process.env.DB_TEST_NAME,
        host: process.env.DB_PROD_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        sync : {force: true}
    }
};
require('dotenv').config();

module.exports = {
    production: {
        username: process.env.DB_PROD_USER,
        password: process.env.DB_PROD_PASSWORD,
        database: process.env.DB_PROD_NAME,
        host: "localhost",
        port: process.env.DB_PORT,
        dialect: 'mysql',
        timezone: '+00:00',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        ssl: {
            require: true,
            rejectUnauthorized: false,
        }
    },
    development: {
        username: process.env.DB_DEV_USER,
        password: process.env.DB_DEV_PASSWORD,
        database: process.env.DB_DEV_NAME,
        host: "localhost",
        port: process.env.DB_PORT,
        dialect: 'mysql',
        logging: false,
        timezone: '+00:00'
    },
};
require('dotenv').config();
const { Sequelize } = require('sequelize');

const getConfig = (env) => {
    const common = {
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        timezone: '+00:00',
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
            timestamps: true
        },
        logging: env === 'development' ? console.log : false
    };

    const configs = {
        development: {
            database: process.env.DB_NAME_DEV,
            username: process.env.DB_USER_DEV,
            password: process.env.DB_PASSWORD_DEV,
            host: process.env.DB_HOST_DEV,
            port: process.env.DB_PORT,
            ...common
        },
        test: {
            database: process.env.DB_NAME_TEST,
            username: process.env.DB_USER_TEST,
            password: process.env.DB_PASSWORD_TEST,
            host: process.env.DB_HOST_TEST,
            port: process.env.DB_PORT,
            ...common,
            logging: false
        },
        production: {
            use_env_variable: 'DATABASE_URL',
            ...common,
            dialectOptions: {
                ssl: {
                    require: true,
                    rejectUnauthorized: false
                }
            },
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    };

    return configs[env] || configs.development;
};

module.exports = {
    development: getConfig('development'),
    test: getConfig('test'),
    production: getConfig('production')
};
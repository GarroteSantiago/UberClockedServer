class DatabaseConnector {
    static instance;
    sequelize;

    constructor(databaseConfig) {
        this.sequelize = databaseConfig;
    }

    static getInstance(databaseConfig) {
        if (!DatabaseConnector.instance) {
            DatabaseConnector.instance = new DatabaseConnector(databaseConfig);
        }
        return DatabaseConnector.instance;
    }

    getSequelize() {
        return this.sequelize;
    }

    async TestConnection() {
        try {
            await this.sequelize.authenticate();
            console.log('Database connection established successfully.');
            return true;
        } catch (error) {
            console.error('Unable to connect to database: ', error);
            return false;
        }
    }

    async syncModels(options = {}) {
        const defaultOptions = {
            alter: process.env.NODE_ENV === 'development',
            force: false,
            logging: console.log
        };

        const finalOptions = { ...defaultOptions, ...options };

        try{
            await this.sequelize.sync(finalOptions);
            console.log('Database models synchronized with options: ', finalOptions);
            return true;
        } catch (error) {
            console.error('Failed to synchronize database models: ', error.message);
            throw error;
        }
    }

    async healthCheck() {
        try{
            const [result] = await this.sequelize.query('SELECT 1 as db_status');
            return {
                status: 'healthy',
                dbStatus: result[0].db_status === 1,
                timestamp: new Date(),
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date(),
            }
        }
    }

    async disconnect() {
        try {
            await this.sequelize.close();
            console.log('Database connection ended successfully.');
            return true;
        } catch (error) {
            console.error('Error disconnecting the database: ', error);
            return false;
        }
    }
}
module.exports = DatabaseConnector;
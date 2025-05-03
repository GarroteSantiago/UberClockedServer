const db = require('../src/models');

module.exports = {
    setupTestDatabase: async () => {
        try {
            if (!await db.testConnection()) {
                throw new Error('Could not connect to test database');
            }
            await db.sequelize.sync({ force: true });
        } catch (error) {
            console.error('Test DB setup failed:', error);
            process.exit(1);
        }
    },
    teardownTestDatabase: async () => {
        try {
            await db.sequelize.close();
        } catch (error) {
            console.error('Test DB teardown failed:', error);
        }
    }
};
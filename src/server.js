const app = require('./app');
const db = require('./models');
const {setupTestDatabase} = require("../tests/testHelpers");

const PORT = process.env.PORT || 3000;

// Start database and server (no code changes needed)
db.testConnection()
    .then(() => {
        db.sequelize.sync()
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`API docs: http://localhost:${PORT}/api-docs`);
        });
    })
    .catch(err => {
        console.error('Database connection failed:', err);
        process.exit(1);
    });
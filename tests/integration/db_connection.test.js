import { expect, it, describe, beforeAll, afterAll } from 'vitest';
import { setupTestDatabase, teardownTestDatabase } from '../testHelpers';
const db = require('../../src/models');

describe('Database Connection and Synchronization', () => {
    beforeAll(async () => {
        await setupTestDatabase();
    }, 10000);

    afterAll(async () => {
        await teardownTestDatabase();
    });

    it('should authenticate with the database', async () => {
        const isConnected = await db.testConnection();
        expect(isConnected).toBe(true);
    });

    it('should have mysql dialect', () => {
        expect(db.sequelize.getDialect()).toBe('mysql');
    });
});
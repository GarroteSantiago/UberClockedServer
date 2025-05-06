const argon2 = require('@node-rs/argon2');

const passwordUtils = {
    async hashPassword(plainPassword) {
        return await argon2.hash(plainPassword, {
            memoryCost: 19456,  // memory usage
            timeCost: 2,       // Number of iterations
            parallelism: 1,    // Number of threads
            hashLength: 32,    // Output size
            saltLength: 16,    // Salt size
        });
    },

    async verifyPassword(plainPassword, hashedPassword) {
        return await argon2.verify(hashedPassword, plainPassword);
    }
};

module.exports = passwordUtils;
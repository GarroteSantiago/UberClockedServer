const { SignJWT } = require('jose');
const { nanoid } = require('nanoid');

const generateToken =
    async (userId, role = 'user') =>
    {
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);

        return await new SignJWT({ id: userId, role })
            .setProtectedHeader({ alg: 'HS256' })
            .setJti(nanoid())
            .setIssuedAt()
            .setExpirationTime(process.env.JWT_EXPIRES_IN || '1d')
            .sign(secret);
    };

module.exports = { generateToken };
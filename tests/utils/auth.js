import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';

const registerAdmin = async (overrides = {}) => {
    const payload = {
        name: 'Admin Test',
        email: 'admin@example.com',
        password: 'password123',
        ...overrides,
    };

    const res = await request(app)
        .post('/v1/auth/register')
        .send(payload)
        .expect(httpStatus.CREATED);

    return {
        token: res.body.tokens.access.token,
        user: res.body.user,
    };
};

export default registerAdmin;

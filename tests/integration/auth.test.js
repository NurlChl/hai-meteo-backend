import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import { adminUsers } from '../../src/db/schema.js';
import db from '../../src/shared/config/database.js';
import bcrypt from 'bcryptjs';

setupTestDB();

describe('Auth Routes', () => {
    describe('POST /v1/auth/register', () => {
        const newUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123',
        };

        test('should return 201 and successfully register user if request data is valid', async () => {
            const res = await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.CREATED);

            expect(res.body.user).toBeDefined();
            expect(res.body.user).not.toHaveProperty('password');
            expect(res.body.tokens).toBeDefined();
            expect(res.body.user.email).toBe(newUser.email);
        });

        test('should return 400 for invalid email', async () => {
            await request(app)
                .post('/v1/auth/register')
                .send({ ...newUser, email: 'not-an-email' })
                .expect(httpStatus.BAD_REQUEST);
        });

        test('should return 400 if email is already taken', async () => {
            await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.CREATED);
            await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
        });
    });

    describe('POST /v1/auth/login', () => {
        let user;
        const password = 'password123';

        beforeEach(async () => {
            const hashedPassword = await bcrypt.hash(password, 8);
            const [insertedUser] = await db.insert(adminUsers).values({
                name: 'Test User',
                email: 'test@example.com',
                passwordHash: hashedPassword,
            }).returning();
            user = insertedUser;
        });

        test('should return 200 and login user if email and password match', async () => {
            const res = await request(app)
                .post('/v1/auth/login')
                .send({ email: user.email, password: password })
                .expect(httpStatus.OK);

            expect(res.body.user).toBeDefined();
            expect(res.body.tokens).toBeDefined();
        });

        test('should return 401 if password is incorrect', async () => {
            await request(app)
                .post('/v1/auth/login')
                .send({ email: user.email, password: 'wrongPassword' })
                .expect(httpStatus.UNAUTHORIZED);
        });
    });
});

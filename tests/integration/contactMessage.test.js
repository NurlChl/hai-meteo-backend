import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import registerAdmin from '../utils/auth.js';

setupTestDB();

describe('Contact Message Routes', () => {
    let token;

    beforeEach(async () => {
        token = (await registerAdmin()).token;
    });

    test('should create a contact message without auth', async () => {
        const res = await request(app)
            .post('/v1/contact-messages')
            .send({
                name: 'Alex',
                email: 'alex@example.com',
                company: 'Meteo Inc.',
                subject: 'Partnership',
                message: 'Interested in collaboration.',
            })
            .expect(httpStatus.CREATED);

        expect(res.body.id).toBeDefined();
        expect(res.body.status).toBe('new');
    });

    test('should return 401 when listing without auth', async () => {
        await request(app)
            .get('/v1/contact-messages')
            .expect(httpStatus.UNAUTHORIZED);
    });

    test('should list and update contact messages with auth', async () => {
        const createRes = await request(app)
            .post('/v1/contact-messages')
            .send({
                name: 'Alex',
                email: 'alex@example.com',
                message: 'Interested in collaboration.',
            })
            .expect(httpStatus.CREATED);

        const listRes = await request(app)
            .get('/v1/contact-messages')
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.OK);

        expect(listRes.body.results).toHaveLength(1);

        const getRes = await request(app)
            .get(`/v1/contact-messages/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.OK);

        expect(getRes.body.email).toBe('alex@example.com');

        const updateRes = await request(app)
            .patch(`/v1/contact-messages/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'done' })
            .expect(httpStatus.OK);

        expect(updateRes.body.status).toBe('done');

        await request(app)
            .delete(`/v1/contact-messages/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NO_CONTENT);

        await request(app)
            .get(`/v1/contact-messages/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NOT_FOUND);
    });
});

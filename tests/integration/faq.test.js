import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import registerAdmin from '../utils/auth.js';

setupTestDB();

describe('FAQ Routes', () => {
    let token;

    beforeEach(async () => {
        token = (await registerAdmin()).token;
    });

    test('should return 401 when creating without auth', async () => {
        await request(app)
            .post('/v1/faqs')
            .send({ question: 'What is Hai Meteo?', answerMd: 'Answer' })
            .expect(httpStatus.UNAUTHORIZED);
    });

    test('should create, list, update, and delete a FAQ', async () => {
        const createRes = await request(app)
            .post('/v1/faqs')
            .set('Authorization', `Bearer ${token}`)
            .send({ question: 'What is Hai Meteo?', answerMd: 'Hai Meteo is a weather platform.' })
            .expect(httpStatus.CREATED);

        expect(createRes.body.id).toBeDefined();

        const getRes = await request(app)
            .get(`/v1/faqs/${createRes.body.id}`)
            .expect(httpStatus.OK);

        expect(getRes.body.id).toBe(createRes.body.id);

        const listRes = await request(app)
            .get('/v1/faqs')
            .expect(httpStatus.OK);

        expect(listRes.body.results).toHaveLength(1);

        const updateRes = await request(app)
            .patch(`/v1/faqs/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ isPublished: false })
            .expect(httpStatus.OK);

        expect(updateRes.body.isPublished).toBe(false);

        await request(app)
            .delete(`/v1/faqs/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NO_CONTENT);

        await request(app)
            .get(`/v1/faqs/${createRes.body.id}`)
            .expect(httpStatus.NOT_FOUND);
    });
});

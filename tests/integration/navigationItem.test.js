import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import registerAdmin from '../utils/auth.js';

setupTestDB();

describe('Navigation Item Routes', () => {
    let token;

    beforeEach(async () => {
        token = (await registerAdmin()).token;
    });

    test('should create and list navigation items', async () => {
        const createRes = await request(app)
            .post('/v1/navigation-items')
            .set('Authorization', `Bearer ${token}`)
            .send({ location: 'header', label: 'Features', href: '/features' })
            .expect(httpStatus.CREATED);

        expect(createRes.body.location).toBe('header');

        const listRes = await request(app)
            .get('/v1/navigation-items?location=header')
            .expect(httpStatus.OK);

        expect(listRes.body.results).toHaveLength(1);
        expect(listRes.body.results[0].label).toBe('Features');
    });

    test('should get, update, and delete a navigation item', async () => {
        const createRes = await request(app)
            .post('/v1/navigation-items')
            .set('Authorization', `Bearer ${token}`)
            .send({ location: 'footer', label: 'Contact', href: '/contact' })
            .expect(httpStatus.CREATED);

        const getRes = await request(app)
            .get(`/v1/navigation-items/${createRes.body.id}`)
            .expect(httpStatus.OK);

        expect(getRes.body.label).toBe('Contact');

        const updateRes = await request(app)
            .patch(`/v1/navigation-items/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ isEnabled: false })
            .expect(httpStatus.OK);

        expect(updateRes.body.isEnabled).toBe(false);

        const filteredRes = await request(app)
            .get('/v1/navigation-items?isEnabled=false')
            .expect(httpStatus.OK);

        expect(filteredRes.body.results).toHaveLength(1);

        await request(app)
            .delete(`/v1/navigation-items/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NO_CONTENT);

        await request(app)
            .get(`/v1/navigation-items/${createRes.body.id}`)
            .expect(httpStatus.NOT_FOUND);
    });
});

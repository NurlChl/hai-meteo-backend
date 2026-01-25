import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import registerAdmin from '../utils/auth.js';

setupTestDB();

describe('Media Asset Routes', () => {
    let token;

    beforeEach(async () => {
        token = (await registerAdmin()).token;
    });

    test('should return 401 when creating without auth', async () => {
        await request(app)
            .post('/v1/media-assets')
            .send({ fileUrl: 'https://cdn.example.com/banner.png' })
            .expect(httpStatus.UNAUTHORIZED);
    });

    test('should create, list, update, and delete a media asset', async () => {
        const payload = {
            fileUrl: 'https://cdn.example.com/banner.png',
            altText: 'Banner',
            mimeType: 'image/png',
            width: 1920,
            height: 1080,
        };

        const createRes = await request(app)
            .post('/v1/media-assets')
            .set('Authorization', `Bearer ${token}`)
            .send(payload)
            .expect(httpStatus.CREATED);

        expect(createRes.body.id).toBeDefined();
        expect(createRes.body.fileUrl).toBe(payload.fileUrl);

        const getRes = await request(app)
            .get(`/v1/media-assets/${createRes.body.id}`)
            .expect(httpStatus.OK);

        expect(getRes.body.id).toBe(createRes.body.id);

        const listRes = await request(app)
            .get('/v1/media-assets')
            .expect(httpStatus.OK);

        expect(listRes.body.results).toHaveLength(1);
        expect(listRes.body.totalResults).toBe(1);

        const updateRes = await request(app)
            .patch(`/v1/media-assets/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ altText: 'Updated Banner' })
            .expect(httpStatus.OK);

        expect(updateRes.body.altText).toBe('Updated Banner');

        await request(app)
            .delete(`/v1/media-assets/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NO_CONTENT);

        await request(app)
            .get(`/v1/media-assets/${createRes.body.id}`)
            .expect(httpStatus.NOT_FOUND);
    });
});

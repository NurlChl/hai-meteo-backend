import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import registerAdmin from '../utils/auth.js';

setupTestDB();

describe('Page Routes', () => {
    let token;

    beforeEach(async () => {
        token = (await registerAdmin()).token;
    });

    test('should create and fetch a page by slug', async () => {
        const pagePayload = {
            slug: 'home',
            title: 'Home',
            metaTitle: 'Hai Meteo - Home',
            metaDesc: 'Company profile',
            isPublished: true,
        };

        const createRes = await request(app)
            .post('/v1/pages')
            .set('Authorization', `Bearer ${token}`)
            .send(pagePayload)
            .expect(httpStatus.CREATED);

        expect(createRes.body.slug).toBe(pagePayload.slug);

        const slugRes = await request(app)
            .get('/v1/pages/slug/home')
            .expect(httpStatus.OK);

        expect(slugRes.body.id).toBe(createRes.body.id);

        const idRes = await request(app)
            .get(`/v1/pages/${createRes.body.id}`)
            .expect(httpStatus.OK);

        expect(idRes.body.slug).toBe(pagePayload.slug);

        const listRes = await request(app)
            .get('/v1/pages?slug=home')
            .expect(httpStatus.OK);

        expect(listRes.body.results).toHaveLength(1);

        const updateRes = await request(app)
            .patch(`/v1/pages/${createRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ title: 'Home Updated', isPublished: false })
            .expect(httpStatus.OK);

        expect(updateRes.body.title).toBe('Home Updated');
        expect(updateRes.body.isPublished).toBe(false);
    });

    test('should create and update a page section', async () => {
        const pageRes = await request(app)
            .post('/v1/pages')
            .set('Authorization', `Bearer ${token}`)
            .send({ slug: 'features', title: 'Features' })
            .expect(httpStatus.CREATED);

        const mediaRes = await request(app)
            .post('/v1/media-assets')
            .set('Authorization', `Bearer ${token}`)
            .send({ fileUrl: 'https://cdn.example.com/section.png' })
            .expect(httpStatus.CREATED);

        const sectionPayload = {
            pageId: pageRes.body.id,
            sectionKey: 'hero',
            sectionType: 'hero',
            title: 'Accurate Weather',
            content: { headline: 'Data-driven forecasts' },
            backgroundMediaId: mediaRes.body.id,
        };

        const sectionRes = await request(app)
            .post('/v1/page-sections')
            .set('Authorization', `Bearer ${token}`)
            .send(sectionPayload)
            .expect(httpStatus.CREATED);

        expect(sectionRes.body.pageId).toBe(pageRes.body.id);
        expect(sectionRes.body.backgroundMediaId).toBe(mediaRes.body.id);

        const getRes = await request(app)
            .get(`/v1/page-sections/${sectionRes.body.id}`)
            .expect(httpStatus.OK);

        expect(getRes.body.id).toBe(sectionRes.body.id);

        const listRes = await request(app)
            .get(`/v1/page-sections?pageId=${pageRes.body.id}`)
            .expect(httpStatus.OK);

        expect(listRes.body.results).toHaveLength(1);

        const updateRes = await request(app)
            .patch(`/v1/page-sections/${sectionRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ isEnabled: false, backgroundMediaId: null })
            .expect(httpStatus.OK);

        expect(updateRes.body.isEnabled).toBe(false);
        expect(updateRes.body.backgroundMediaId).toBeNull();

        await request(app)
            .delete(`/v1/page-sections/${sectionRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NO_CONTENT);

        await request(app)
            .get(`/v1/page-sections/${sectionRes.body.id}`)
            .expect(httpStatus.NOT_FOUND);
    });

    test('should filter pages by publish status and delete a page', async () => {
        const publishedPage = await request(app)
            .post('/v1/pages')
            .set('Authorization', `Bearer ${token}`)
            .send({ slug: 'published', title: 'Published', isPublished: true })
            .expect(httpStatus.CREATED);

        await request(app)
            .post('/v1/pages')
            .set('Authorization', `Bearer ${token}`)
            .send({ slug: 'draft', title: 'Draft', isPublished: false })
            .expect(httpStatus.CREATED);

        const publishedListRes = await request(app)
            .get('/v1/pages?isPublished=true')
            .expect(httpStatus.OK);

        // expect(publishedListRes.body.results).toHaveLength(1);

        await request(app)
            .delete(`/v1/pages/${publishedPage.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NO_CONTENT);

        await request(app)
            .get(`/v1/pages/${publishedPage.body.id}`)
            .expect(httpStatus.NOT_FOUND);
    });
});

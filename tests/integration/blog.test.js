import request from 'supertest';
import httpStatus from 'http-status';
import app from '../../src/app.js';
import setupTestDB from '../utils/setupTestDB.js';
import registerAdmin from '../utils/auth.js';

setupTestDB();

describe('Blog Routes', () => {
    let token;

    beforeEach(async () => {
        token = (await registerAdmin()).token;
    });

    test('should create categories, tags, and a blog post', async () => {
        const categoryRes = await request(app)
            .post('/v1/blog-categories')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Insight', slug: 'insight' })
            .expect(httpStatus.CREATED);

        const tagRes = await request(app)
            .post('/v1/blog-tags')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Forecast', slug: 'forecast' })
            .expect(httpStatus.CREATED);

        const postRes = await request(app)
            .post('/v1/blog-posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: 'weekly-weather',
                title: 'Weekly Weather',
                contentMd: '# Weather',
                categoryIds: [categoryRes.body.id],
                tagIds: [tagRes.body.id],
            })
            .expect(httpStatus.CREATED);

        expect(postRes.body.categoryIds).toEqual([categoryRes.body.id]);
        expect(postRes.body.tagIds).toEqual([tagRes.body.id]);

        const getRes = await request(app)
            .get(`/v1/blog-posts/${postRes.body.id}`)
            .expect(httpStatus.OK);

        expect(getRes.body.title).toBe('Weekly Weather');

        const listRes = await request(app)
            .get('/v1/blog-posts')
            .expect(httpStatus.OK);

        expect(listRes.body.results).toHaveLength(1);
    });

    test('should set publishedAt when publishing a post', async () => {
        const postRes = await request(app)
            .post('/v1/blog-posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: 'daily-weather',
                title: 'Daily Weather',
                contentMd: '# Daily Weather',
            })
            .expect(httpStatus.CREATED);

        const updateRes = await request(app)
            .patch(`/v1/blog-posts/${postRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ status: 'published' })
            .expect(httpStatus.OK);

        expect(updateRes.body.publishedAt).toBeTruthy();
    });

    test('should manage blog categories and tags', async () => {
        const categoryRes = await request(app)
            .post('/v1/blog-categories')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Insight', slug: 'insight' })
            .expect(httpStatus.CREATED);

        const categoryGetRes = await request(app)
            .get(`/v1/blog-categories/${categoryRes.body.id}`)
            .expect(httpStatus.OK);

        expect(categoryGetRes.body.name).toBe('Insight');

        const categoryUpdateRes = await request(app)
            .patch(`/v1/blog-categories/${categoryRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Insight Updated' })
            .expect(httpStatus.OK);

        expect(categoryUpdateRes.body.name).toBe('Insight Updated');

        const categoryListRes = await request(app)
            .get('/v1/blog-categories')
            .expect(httpStatus.OK);

        expect(categoryListRes.body.results).toHaveLength(1);

        await request(app)
            .delete(`/v1/blog-categories/${categoryRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NO_CONTENT);

        await request(app)
            .get(`/v1/blog-categories/${categoryRes.body.id}`)
            .expect(httpStatus.NOT_FOUND);

        const tagRes = await request(app)
            .post('/v1/blog-tags')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Forecast', slug: 'forecast' })
            .expect(httpStatus.CREATED);

        const tagGetRes = await request(app)
            .get(`/v1/blog-tags/${tagRes.body.id}`)
            .expect(httpStatus.OK);

        expect(tagGetRes.body.name).toBe('Forecast');

        const tagUpdateRes = await request(app)
            .patch(`/v1/blog-tags/${tagRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Forecast Updated' })
            .expect(httpStatus.OK);

        expect(tagUpdateRes.body.name).toBe('Forecast Updated');

        const tagListRes = await request(app)
            .get('/v1/blog-tags')
            .expect(httpStatus.OK);

        expect(tagListRes.body.results).toHaveLength(1);

        await request(app)
            .delete(`/v1/blog-tags/${tagRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NO_CONTENT);

        await request(app)
            .get(`/v1/blog-tags/${tagRes.body.id}`)
            .expect(httpStatus.NOT_FOUND);
    });

    test('should delete a blog post', async () => {
        const postRes = await request(app)
            .post('/v1/blog-posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: 'monthly-weather',
                title: 'Monthly Weather',
                contentMd: '# Monthly Weather',
            })
            .expect(httpStatus.CREATED);

        await request(app)
            .delete(`/v1/blog-posts/${postRes.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(httpStatus.NO_CONTENT);

        await request(app)
            .get(`/v1/blog-posts/${postRes.body.id}`)
            .expect(httpStatus.NOT_FOUND);
    });

    test('should filter blog posts by status', async () => {
        await request(app)
            .post('/v1/blog-posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: 'weather-draft',
                title: 'Weather Draft',
                contentMd: '# Weather Draft',
                status: 'draft',
            })
            .expect(httpStatus.CREATED);

        await request(app)
            .post('/v1/blog-posts')
            .set('Authorization', `Bearer ${token}`)
            .send({
                slug: 'weather-published',
                title: 'Weather Published',
                contentMd: '# Weather Published',
                status: 'published',
            })
            .expect(httpStatus.CREATED);

        const listRes = await request(app)
            .get('/v1/blog-posts?status=published')
            .expect(httpStatus.OK);

        expect(listRes.body.results).toHaveLength(1);
        expect(listRes.body.results[0].status).toBe('published');
    });
});

import { jest } from '@jest/globals';
import request from 'supertest';
import httpStatus from 'http-status';
import setupTestDB from '../utils/setupTestDB.js';

const uploadBufferToGcsMock = jest.fn();
const buildStorageObjectKeyMock = jest.fn();
const resolveStoredFileUrlMock = jest.fn((value) => value);

jest.unstable_mockModule('../../src/shared/config/storage.js', () => ({
    uploadBufferToGcs: uploadBufferToGcsMock,
    buildStorageObjectKey: buildStorageObjectKeyMock,
    resolveStoredFileUrl: resolveStoredFileUrlMock,
}));

const { default: app } = await import('../../src/app.js');

setupTestDB();

describe('Media Asset Routes', () => {
    let token;

    const registerAdmin = async (overrides = {}) => {
        const payload = {
            name: 'Admin Test',
            email: 'admin@example.com',
            password: 'password123',
            ...overrides,
        };

        const res = await request(app).post('/v1/auth/register').send(payload).expect(httpStatus.CREATED);

        return {
            token: res.body.tokens.access.token,
            user: res.body.user,
        };
    };

    beforeEach(async () => {
        jest.clearAllMocks();
        resolveStoredFileUrlMock.mockImplementation(value => value);
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

        const getRes = await request(app).get(`/v1/media-assets/${createRes.body.id}`).expect(httpStatus.OK);

        expect(getRes.body.id).toBe(createRes.body.id);

        const listRes = await request(app).get('/v1/media-assets').expect(httpStatus.OK);

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

        await request(app).get(`/v1/media-assets/${createRes.body.id}`).expect(httpStatus.NOT_FOUND);
    });

    test('should return 400 when upload MIME type is invalid', async () => {
        await request(app)
            .post('/v1/media-assets/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', Buffer.from('not-an-image'), {
                filename: 'note.txt',
                contentType: 'text/plain',
            })
            .expect(httpStatus.BAD_REQUEST);
    });

    test('should upload a media asset to GCS and persist the public URL', async () => {
        buildStorageObjectKeyMock.mockReturnValue('media-assets/2024/04/sample.png');
        uploadBufferToGcsMock.mockResolvedValue({
            objectKey: 'media-assets/2024/04/sample.png',
            fileUrl: 'https://storage.googleapis.com/assets-bucket/media-assets/2024/04/sample.png',
        });

        const response = await request(app)
            .post('/v1/media-assets/upload')
            .set('Authorization', `Bearer ${token}`)
            .field('altText', 'Homepage hero')
            .field('width', '1280')
            .field('height', '720')
            .attach('file', Buffer.from('image-bytes'), {
                filename: 'hero.png',
                contentType: 'image/png',
            })
            .expect(httpStatus.CREATED);

        expect(buildStorageObjectKeyMock).toHaveBeenCalledWith(
            expect.objectContaining({
                originalname: 'hero.png',
                mimetype: 'image/png',
            }),
        );
        expect(uploadBufferToGcsMock).toHaveBeenCalledWith({
            file: expect.objectContaining({
                originalname: 'hero.png',
                mimetype: 'image/png',
            }),
            objectKey: 'media-assets/2024/04/sample.png',
        });
        expect(response.body.fileUrl).toBe(
            'https://storage.googleapis.com/assets-bucket/media-assets/2024/04/sample.png',
        );
        expect(response.body.altText).toBe('Homepage hero');
        expect(response.body.width).toBe(1280);
        expect(response.body.height).toBe(720);
    });

    test('should upload a video media asset to GCS and persist the public URL', async () => {
        buildStorageObjectKeyMock.mockReturnValue('media-assets/2024/04/intro.mp4');
        uploadBufferToGcsMock.mockResolvedValue({
            objectKey: 'media-assets/2024/04/intro.mp4',
            fileUrl: 'https://storage.googleapis.com/assets-bucket/media-assets/2024/04/intro.mp4',
        });

        const response = await request(app)
            .post('/v1/media-assets/upload')
            .set('Authorization', `Bearer ${token}`)
            .field('altText', 'Landing intro video')
            .attach('file', Buffer.from('video-bytes'), {
                filename: 'intro.mp4',
                contentType: 'video/mp4',
            })
            .expect(httpStatus.CREATED);

        expect(response.body.fileUrl).toBe('https://storage.googleapis.com/assets-bucket/media-assets/2024/04/intro.mp4');
        expect(response.body.mimeType).toBe('video/mp4');
    });

    test('should return 400 when file is missing from upload request', async () => {
        await request(app)
            .post('/v1/media-assets/upload')
            .set('Authorization', `Bearer ${token}`)
            .field('altText', 'Missing file')
            .expect(httpStatus.BAD_REQUEST);
    });

    test('should return 500 when GCS upload fails', async () => {
        buildStorageObjectKeyMock.mockReturnValue('media-assets/2024/04/sample.png');
        uploadBufferToGcsMock.mockRejectedValue(new Error('gcs unavailable'));

        const response = await request(app)
            .post('/v1/media-assets/upload')
            .set('Authorization', `Bearer ${token}`)
            .attach('file', Buffer.from('image-bytes'), {
                filename: 'hero.png',
                contentType: 'image/png',
            })
            .expect(httpStatus.INTERNAL_SERVER_ERROR);

        expect(response.body.message).toBe('Internal Server Error');
    });
});

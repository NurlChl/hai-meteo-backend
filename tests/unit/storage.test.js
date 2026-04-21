import { jest } from '@jest/globals';

const saveMock = jest.fn();
const getSignedUrlMock = jest.fn();
const storageCtorMock = jest.fn(() => ({
    bucket: jest.fn(() => ({
        file: jest.fn(() => ({
            save: saveMock,
            getSignedUrl: getSignedUrlMock,
        })),
    })),
}));

jest.unstable_mockModule('@google-cloud/storage', () => ({
    Storage: storageCtorMock,
}));

process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'abcdefghijklmnopqrstuvwxyz123456';

const { buildStorageObjectKey, buildPublicFileUrl, uploadBufferToGcs, resolveStoredFileUrl } = await import(
    '../../src/shared/config/storage.js'
);

describe('storage config', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('buildStorageObjectKey creates a dated path with extension', () => {
        jest.spyOn(Date, 'now').mockReturnValue(1713279123456);
        jest.spyOn(Math, 'random').mockReturnValue(0.482913401);

        const objectKey = buildStorageObjectKey(
            {
                originalname: 'hero-banner.mp4',
                mimetype: 'video/mp4',
            },
            {
                uploadPathPrefix: 'media-assets',
            },
        );

        expect(objectKey).toBe('media-assets/2024/04/1713279123456-482913401.mp4');
    });

    test('buildPublicFileUrl uses configured public base URL', () => {
        const publicUrl = buildPublicFileUrl('media-assets/2024/04/sample.png', {
            publicBaseUrl: 'https://storage.googleapis.com/assets-bucket',
        });

        expect(publicUrl).toBe('https://storage.googleapis.com/assets-bucket/media-assets/2024/04/sample.png');
    });

    test('uploadBufferToGcs saves the file with metadata', async () => {
        saveMock.mockResolvedValue(undefined);

        const result = await uploadBufferToGcs({
            file: {
                buffer: Buffer.from('binary'),
                mimetype: 'image/png',
                originalname: 'banner.png',
            },
            objectKey: 'media-assets/2024/04/sample.png',
            configOverride: {
                bucketName: 'assets-bucket',
                projectId: 'project-123',
                keyFilename: './service_account.json',
                publicBaseUrl: 'https://storage.googleapis.com/assets-bucket',
                uploadPathPrefix: 'media-assets',
            },
        });

        expect(saveMock).toHaveBeenCalledWith(Buffer.from('binary'), {
            resumable: false,
            metadata: {
                contentType: 'image/png',
                cacheControl: 'public, max-age=31536000, immutable',
            },
        });
        expect(result.fileUrl).toBe('https://storage.googleapis.com/assets-bucket/media-assets/2024/04/sample.png');
    });

    test('resolveStoredFileUrl returns a signed URL for stored object keys', async () => {
        jest.spyOn(Date, 'now').mockReturnValue(1713279123456);
        getSignedUrlMock.mockResolvedValue(['https://storage.googleapis.com/assets-bucket/media-assets/2024/04/sample.png?X-Goog-Signature=test']);

        const fileUrl = await resolveStoredFileUrl('media-assets/2024/04/sample.png', {
            bucketName: 'assets-bucket',
            projectId: 'project-123',
            keyFilename: './service_account.json',
            signedUrlExpiresMinutes: 60,
        });

        expect(fileUrl).toBe('https://storage.googleapis.com/assets-bucket/media-assets/2024/04/sample.png?X-Goog-Signature=test');
        expect(getSignedUrlMock).toHaveBeenCalledWith({
            version: 'v4',
            action: 'read',
            expires: 1713282723456,
        });
    });

    test('resolveStoredFileUrl extracts object keys from stored public bucket URLs', async () => {
        jest.spyOn(Date, 'now').mockReturnValue(1713279123456);
        getSignedUrlMock.mockResolvedValue(['https://signed.example.com/media-assets/2024/04/sample.png']);

        const fileUrl = await resolveStoredFileUrl('https://storage.googleapis.com/assets-bucket/media-assets/2024/04/sample.png', {
            bucketName: 'assets-bucket',
            projectId: 'project-123',
            keyFilename: './service_account.json',
            publicBaseUrl: 'https://storage.googleapis.com/assets-bucket',
            signedUrlExpiresMinutes: 60,
        });

        expect(fileUrl).toBe('https://signed.example.com/media-assets/2024/04/sample.png');
    });
});

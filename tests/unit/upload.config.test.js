import { allowedMimeTypes, MAX_MEDIA_FILE_SIZE_BYTES } from '../../src/shared/config/upload.js';

describe('upload config', () => {
    test('allows supported video MIME types', () => {
        expect(allowedMimeTypes).toEqual(
            expect.arrayContaining(['video/mp4', 'video/webm', 'video/quicktime']),
        );
    });

    test('supports media uploads up to 50MB', () => {
        expect(MAX_MEDIA_FILE_SIZE_BYTES).toBe(50 * 1024 * 1024);
    });
});

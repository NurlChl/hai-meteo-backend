import { jest } from '@jest/globals';
import multer from 'multer';
import httpStatus from 'http-status';

const mockLogger = {
    error: jest.fn(),
};

jest.unstable_mockModule('../../src/shared/config/logger.js', () => ({
    default: mockLogger,
}));

const errorHandler = (await import('../../src/shared/middlewares/errorHandler.js')).default;

const createRes = () => {
    const res = {};
    res.locals = {};
    res.status = jest.fn(() => res);
    res.send = jest.fn(() => res);
    return res;
};

describe('Error Handler upload errors', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
        process.env.NODE_ENV = 'test';
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        jest.clearAllMocks();
    });

    test('maps multer file size errors to 413 with a clear message', () => {
        const res = createRes();
        const err = new multer.MulterError('LIMIT_FILE_SIZE');

        errorHandler(err, {}, res, () => {});

        expect(res.status).toHaveBeenCalledWith(httpStatus.REQUEST_ENTITY_TOO_LARGE);
        expect(res.send).toHaveBeenCalledWith({
            code: httpStatus.REQUEST_ENTITY_TOO_LARGE,
            message: 'File too large. Maximum upload size is 50MB.',
        });
    });
});

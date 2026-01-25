import { jest } from '@jest/globals';

const mockLogger = {
    error: jest.fn(),
};

jest.unstable_mockModule('http-status', () => ({
    default: {
        INTERNAL_SERVER_ERROR: 500,
    },
}));

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

describe('Error Handler Middleware fallback', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
        process.env.NODE_ENV = 'test';
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        jest.clearAllMocks();
    });

    test('should fallback to generic message when http-status map is missing', () => {
        const res = createRes();
        const err = new Error('Boom');

        errorHandler(err, {}, res, () => {});

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({ code: 500, message: 'Internal Server Error' });
    });
});

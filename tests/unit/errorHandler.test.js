import { jest } from '@jest/globals';
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

describe('Error Handler Middleware', () => {
    const originalEnv = process.env.NODE_ENV;

    beforeEach(() => {
        process.env.NODE_ENV = 'test';
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        jest.clearAllMocks();
    });

    test('should use provided status code and message', () => {
        const res = createRes();
        const err = { statusCode: httpStatus.BAD_REQUEST, message: 'Bad request' };

        errorHandler(err, {}, res, () => {});

        expect(res.status).toHaveBeenCalledWith(httpStatus.BAD_REQUEST);
        expect(res.send).toHaveBeenCalledWith({ code: httpStatus.BAD_REQUEST, message: 'Bad request' });
    });

    test('should default to 500 when statusCode is missing', () => {
        const res = createRes();
        const err = new Error('Boom');

        errorHandler(err, {}, res, () => {});

        expect(res.status).toHaveBeenCalledWith(httpStatus.INTERNAL_SERVER_ERROR);
        expect(res.send).toHaveBeenCalledWith({
            code: httpStatus.INTERNAL_SERVER_ERROR,
            message: httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
        });
    });

    test('should include stack and log in development', () => {
        process.env.NODE_ENV = 'development';

        const res = createRes();
        const err = new Error('Boom');

        errorHandler(err, {}, res, () => {});

        const response = res.send.mock.calls[0][0];
        expect(response.stack).toBeDefined();
        expect(mockLogger.error).toHaveBeenCalledWith(err);
    });
});

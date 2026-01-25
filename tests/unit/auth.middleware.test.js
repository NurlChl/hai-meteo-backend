import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockJwt = {
    verify: jest.fn(),
};

const mockWhere = jest.fn();
const mockFrom = jest.fn(() => ({ where: mockWhere }));
const mockDb = {
    select: jest.fn(() => ({ from: mockFrom })),
};

jest.unstable_mockModule('jsonwebtoken', () => ({
    default: mockJwt,
}));
jest.unstable_mockModule('../../src/shared/config/database.js', () => ({
    default: mockDb,
}));
jest.unstable_mockModule('../../src/shared/config/index.js', () => ({
    default: {
        jwt: {
            secret: 'test-secret',
        },
    },
}));

const auth = (await import('../../src/shared/middlewares/authMiddleware.js')).default;

describe('Auth Middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should return 401 when authorization header is missing', async () => {
        const req = { headers: {} };
        const next = jest.fn();

        await auth()(req, {}, next);

        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(ApiError);
        expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
        expect(error.message).toBe('Please authenticate');
    });

    test('should return 401 when token is invalid', async () => {
        const tokenError = new Error('invalid token');
        tokenError.name = 'JsonWebTokenError';
        mockJwt.verify.mockImplementation(() => {
            throw tokenError;
        });

        const req = { headers: { authorization: 'Bearer invalid' } };
        const next = jest.fn();

        await auth()(req, {}, next);

        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(ApiError);
        expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
        expect(error.message).toBe('Please authenticate');
    });

    test('should return 401 when user is not found', async () => {
        mockJwt.verify.mockReturnValue({ sub: 1 });
        mockWhere.mockResolvedValue([]);

        const req = { headers: { authorization: 'Bearer valid' } };
        const next = jest.fn();

        await auth()(req, {}, next);

        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(ApiError);
        expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
        expect(error.message).toBe('User not found');
    });

    test('should return 401 when user is inactive', async () => {
        mockJwt.verify.mockReturnValue({ sub: 1 });
        mockWhere.mockResolvedValue([{ id: 1, email: 'test@example.com', isActive: false }]);

        const req = { headers: { authorization: 'Bearer valid' } };
        const next = jest.fn();

        await auth()(req, {}, next);

        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(ApiError);
        expect(error.statusCode).toBe(httpStatus.UNAUTHORIZED);
        expect(error.message).toBe('User not found');
    });

    test('should pass through unexpected errors', async () => {
        const unexpectedError = new Error('db failed');
        mockJwt.verify.mockReturnValue({ sub: 1 });
        mockWhere.mockRejectedValue(unexpectedError);

        const req = { headers: { authorization: 'Bearer valid' } };
        const next = jest.fn();

        await auth()(req, {}, next);

        expect(next).toHaveBeenCalledWith(unexpectedError);
    });

    test('should attach user and call next when token is valid', async () => {
        mockJwt.verify.mockReturnValue({ sub: 1 });
        mockWhere.mockResolvedValue([
            { id: 1, email: 'test@example.com', passwordHash: 'hash', isActive: true },
        ]);

        const req = { headers: { authorization: 'Bearer valid' } };
        const next = jest.fn();

        await auth()(req, {}, next);

        expect(req.user).toEqual({ id: 1, email: 'test@example.com', isActive: true });
        expect(next).toHaveBeenCalledWith();
    });
});

import { jest } from '@jest/globals';
import pick from '../../src/shared/utils/pick.js';
import catchAsync from '../../src/shared/utils/catchAsync.js';
import ApiError from '../../src/shared/utils/ApiError.js';

describe('Shared Utils', () => {
    test('pick should return only selected keys', () => {
        const result = pick({ a: 1, b: 2 }, ['a', 'c']);

        expect(result).toEqual({ a: 1 });
    });

    test('pick should handle null input', () => {
        const result = pick(null, ['a']);

        expect(result).toEqual({});
    });

    test('catchAsync should pass errors to next', async () => {
        const error = new Error('Boom');
        const next = jest.fn();

        const handler = catchAsync(() => Promise.reject(error));

        await new Promise((resolve) => {
            handler({}, {}, (err) => {
                next(err);
                resolve();
            });
        });

        expect(next).toHaveBeenCalledWith(error);
    });

    test('ApiError should set statusCode and message', () => {
        const apiError = new ApiError(400, 'Bad request');

        expect(apiError.statusCode).toBe(400);
        expect(apiError.message).toBe('Bad request');
        expect(apiError.isOperational).toBe(true);
    });

    test('ApiError should accept custom stack', () => {
        const apiError = new ApiError(500, 'Server error', true, 'custom-stack');

        expect(apiError.stack).toBe('custom-stack');
    });
});

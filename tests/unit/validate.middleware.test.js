import { jest } from '@jest/globals';
import Joi from 'joi';
import httpStatus from 'http-status';
import validate from '../../src/shared/middlewares/validate.js';
import ApiError from '../../src/shared/utils/ApiError.js';

describe('Validate Middleware', () => {
    test('should pass with validated data and apply defaults', () => {
        const schema = {
            body: Joi.object().keys({
                name: Joi.string().required(),
            }),
            query: Joi.object().keys({
                limit: Joi.number().integer().default(10),
            }),
        };

        const req = { body: { name: 'Hello Meteo' }, query: {} };
        const next = jest.fn();

        validate(schema)(req, {}, next);

        expect(next).toHaveBeenCalledWith();
        expect(req.query.limit).toBe(10);
    });

    test('should return ApiError for invalid request', () => {
        const schema = {
            body: Joi.object().keys({
                name: Joi.string().required(),
            }),
        };

        const req = { body: {}, query: {} };
        const next = jest.fn();

        validate(schema)(req, {}, next);

        const error = next.mock.calls[0][0];
        expect(error).toBeInstanceOf(ApiError);
        expect(error.statusCode).toBe(httpStatus.BAD_REQUEST);
    });
});

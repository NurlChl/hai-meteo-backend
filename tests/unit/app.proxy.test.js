import { jest } from '@jest/globals';
import express from 'express';

const mockGeneralLimiter = jest.fn((req, res, next) => next());
const mockSetupSwagger = jest.fn();

jest.unstable_mockModule('../../src/shared/config/index.js', () => ({
    default: {
        proxy: {
            trust: 1,
        },
    },
}));

jest.unstable_mockModule('../../src/shared/middlewares/rateLimiter.js', () => ({
    generalLimiter: mockGeneralLimiter,
}));

jest.unstable_mockModule('../../src/routes/index.js', () => ({
    default: express.Router(),
}));

jest.unstable_mockModule('../../src/shared/config/swagger.js', () => ({
    default: mockSetupSwagger,
}));

const app = (await import('../../src/app.js')).default;

describe('Express app proxy settings', () => {
    test('uses configured trust proxy before handling requests', () => {
        expect(app.get('trust proxy')).toBe(1);
    });
});

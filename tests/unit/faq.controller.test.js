import { jest } from '@jest/globals';

const mockFaqService = {
    getFaqs: jest.fn(),
};

jest.unstable_mockModule('../../src/features/faq/faq.service.js', () => mockFaqService);

const faqController = await import('../../src/features/faq/faq.controller.js');

const createRes = () => {
    const res = {};
    res.send = jest.fn(() => res);
    res.status = jest.fn(() => res);
    return res;
};

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

describe('FAQ Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should coerce string isPublished to boolean', async () => {
        mockFaqService.getFaqs.mockResolvedValue({ results: [] });

        const req = { query: { isPublished: 'true' } };
        const res = createRes();
        const next = jest.fn();

        faqController.getFaqs(req, res, next);
        await flushPromises();

        expect(mockFaqService.getFaqs).toHaveBeenCalledWith(expect.objectContaining({ isPublished: true }));
        expect(res.send).toHaveBeenCalledWith({ results: [] });
    });

    test('should keep boolean isPublished as-is', async () => {
        mockFaqService.getFaqs.mockResolvedValue({ results: [] });

        const req = { query: { isPublished: false } };
        const res = createRes();
        const next = jest.fn();

        faqController.getFaqs(req, res, next);
        await flushPromises();

        expect(mockFaqService.getFaqs).toHaveBeenCalledWith(expect.objectContaining({ isPublished: false }));
        expect(res.send).toHaveBeenCalledWith({ results: [] });
    });
});

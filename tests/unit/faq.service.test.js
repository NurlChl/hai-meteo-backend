import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockFaqRepository = {
    createFaq: jest.fn(),
    getFaqs: jest.fn(),
    getFaqById: jest.fn(),
    updateFaqById: jest.fn(),
    deleteFaqById: jest.fn(),
};

jest.unstable_mockModule('../../src/features/faq/faq.repository.js', () => mockFaqRepository);

const faqService = await import('../../src/features/faq/faq.service.js');

describe('FAQ Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create an FAQ', async () => {
        mockFaqRepository.createFaq.mockResolvedValue({ id: 1, question: 'What is Hai Meteo?' });

        const result = await faqService.createFaq({ question: 'What is Hai Meteo?', answerMd: 'Answer.' });

        expect(mockFaqRepository.createFaq).toHaveBeenCalled();
        expect(result.question).toBe('What is Hai Meteo?');
    });

    test('should get FAQs', async () => {
        mockFaqRepository.getFaqs.mockResolvedValue({ results: [], totalResults: 0 });

        const result = await faqService.getFaqs({ limit: 5, offset: 0 });

        expect(mockFaqRepository.getFaqs).toHaveBeenCalledWith({ limit: 5, offset: 0 });
        expect(result.totalResults).toBe(0);
    });

    test('should throw error when FAQ is not found', async () => {
        mockFaqRepository.getFaqById.mockResolvedValue(null);

        await expect(faqService.getFaqById(999)).rejects.toThrow(ApiError);
        await expect(faqService.getFaqById(999)).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'FAQ not found',
        });
    });

    test('should update an FAQ by id', async () => {
        mockFaqRepository.getFaqById.mockResolvedValue({ id: 10 });
        mockFaqRepository.updateFaqById.mockResolvedValue({ id: 10, isPublished: false });

        const result = await faqService.updateFaqById(10, { isPublished: false });

        expect(mockFaqRepository.updateFaqById).toHaveBeenCalledWith(10, { isPublished: false });
        expect(result.isPublished).toBe(false);
    });

    test('should delete an FAQ by id', async () => {
        mockFaqRepository.getFaqById.mockResolvedValue({ id: 10 });
        mockFaqRepository.deleteFaqById.mockResolvedValue({ id: 10 });

        await faqService.deleteFaqById(10);

        expect(mockFaqRepository.deleteFaqById).toHaveBeenCalledWith(10);
    });
});

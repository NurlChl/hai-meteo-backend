import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockPageRepository = {
    createPage: jest.fn(),
    getPages: jest.fn(),
    getPageById: jest.fn(),
    getPageBySlug: jest.fn(),
    updatePageById: jest.fn(),
    deletePageById: jest.fn(),
};

jest.unstable_mockModule('../../src/features/page/page.repository.js', () => mockPageRepository);

const pageService = await import('../../src/features/page/page.service.js');

describe('Page Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a page', async () => {
        mockPageRepository.createPage.mockResolvedValue({ id: 1, slug: 'home' });

        const result = await pageService.createPage({ slug: 'home', title: 'Home' });

        expect(mockPageRepository.createPage).toHaveBeenCalled();
        expect(result.slug).toBe('home');
    });

    test('should get pages', async () => {
        mockPageRepository.getPages.mockResolvedValue({ results: [], totalResults: 0 });

        const result = await pageService.getPages({ limit: 5, offset: 0 });

        expect(mockPageRepository.getPages).toHaveBeenCalledWith({ limit: 5, offset: 0 });
        expect(result.totalResults).toBe(0);
    });

    test('should throw error when page is not found', async () => {
        mockPageRepository.getPageById.mockResolvedValue(null);

        await expect(pageService.getPageById(999)).rejects.toThrow(ApiError);
        await expect(pageService.getPageById(999)).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'Page not found',
        });
    });

    test('should throw error when page slug is not found', async () => {
        mockPageRepository.getPageBySlug.mockResolvedValue(null);

        await expect(pageService.getPageBySlug('missing')).rejects.toThrow(ApiError);
        await expect(pageService.getPageBySlug('missing')).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'Page not found',
        });
    });

    test('should update a page by id', async () => {
        mockPageRepository.getPageById.mockResolvedValue({ id: 10 });
        mockPageRepository.updatePageById.mockResolvedValue({ id: 10, title: 'Updated' });

        const result = await pageService.updatePageById(10, { title: 'Updated' });

        expect(mockPageRepository.updatePageById).toHaveBeenCalledWith(10, { title: 'Updated' });
        expect(result.title).toBe('Updated');
    });

    test('should delete a page by id', async () => {
        mockPageRepository.getPageById.mockResolvedValue({ id: 10 });
        mockPageRepository.deletePageById.mockResolvedValue({ id: 10 });

        await pageService.deletePageById(10);

        expect(mockPageRepository.deletePageById).toHaveBeenCalledWith(10);
    });
});

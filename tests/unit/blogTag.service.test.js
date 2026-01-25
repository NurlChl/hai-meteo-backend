import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockBlogTagRepository = {
    createBlogTag: jest.fn(),
    getBlogTags: jest.fn(),
    getBlogTagById: jest.fn(),
    updateBlogTagById: jest.fn(),
    deleteBlogTagById: jest.fn(),
};

jest.unstable_mockModule('../../src/features/blogTag/blogTag.repository.js', () => mockBlogTagRepository);

const blogTagService = await import('../../src/features/blogTag/blogTag.service.js');

describe('Blog Tag Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a blog tag', async () => {
        mockBlogTagRepository.createBlogTag.mockResolvedValue({ id: 1, name: 'Forecast' });

        const result = await blogTagService.createBlogTag({ name: 'Forecast', slug: 'forecast' });

        expect(mockBlogTagRepository.createBlogTag).toHaveBeenCalled();
        expect(result.name).toBe('Forecast');
    });

    test('should get blog tags', async () => {
        mockBlogTagRepository.getBlogTags.mockResolvedValue({ results: [], totalResults: 0 });

        const result = await blogTagService.getBlogTags({ limit: 5, offset: 0 });

        expect(mockBlogTagRepository.getBlogTags).toHaveBeenCalledWith({ limit: 5, offset: 0 });
        expect(result.totalResults).toBe(0);
    });

    test('should throw error when blog tag is not found', async () => {
        mockBlogTagRepository.getBlogTagById.mockResolvedValue(null);

        await expect(blogTagService.getBlogTagById(999)).rejects.toThrow(ApiError);
        await expect(blogTagService.getBlogTagById(999)).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'Blog tag not found',
        });
    });

    test('should update a blog tag by id', async () => {
        mockBlogTagRepository.getBlogTagById.mockResolvedValue({ id: 10 });
        mockBlogTagRepository.updateBlogTagById.mockResolvedValue({ id: 10, name: 'Updated' });

        const result = await blogTagService.updateBlogTagById(10, { name: 'Updated' });

        expect(mockBlogTagRepository.updateBlogTagById).toHaveBeenCalledWith(10, { name: 'Updated' });
        expect(result.name).toBe('Updated');
    });

    test('should delete a blog tag by id', async () => {
        mockBlogTagRepository.getBlogTagById.mockResolvedValue({ id: 10 });
        mockBlogTagRepository.deleteBlogTagById.mockResolvedValue({ id: 10 });

        await blogTagService.deleteBlogTagById(10);

        expect(mockBlogTagRepository.deleteBlogTagById).toHaveBeenCalledWith(10);
    });
});

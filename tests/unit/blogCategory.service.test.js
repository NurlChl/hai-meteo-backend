import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockBlogCategoryRepository = {
    createBlogCategory: jest.fn(),
    getBlogCategories: jest.fn(),
    getBlogCategoryById: jest.fn(),
    updateBlogCategoryById: jest.fn(),
    deleteBlogCategoryById: jest.fn(),
};

jest.unstable_mockModule(
    '../../src/features/blogCategory/blogCategory.repository.js',
    () => mockBlogCategoryRepository
);

const blogCategoryService = await import('../../src/features/blogCategory/blogCategory.service.js');

describe('Blog Category Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a blog category', async () => {
        mockBlogCategoryRepository.createBlogCategory.mockResolvedValue({ id: 1, name: 'Insight' });

        const result = await blogCategoryService.createBlogCategory({ name: 'Insight', slug: 'insight' });

        expect(mockBlogCategoryRepository.createBlogCategory).toHaveBeenCalled();
        expect(result.name).toBe('Insight');
    });

    test('should get blog categories', async () => {
        mockBlogCategoryRepository.getBlogCategories.mockResolvedValue({ results: [], totalResults: 0 });

        const result = await blogCategoryService.getBlogCategories({ limit: 5, offset: 0 });

        expect(mockBlogCategoryRepository.getBlogCategories).toHaveBeenCalledWith({ limit: 5, offset: 0 });
        expect(result.totalResults).toBe(0);
    });

    test('should throw error when blog category is not found', async () => {
        mockBlogCategoryRepository.getBlogCategoryById.mockResolvedValue(null);

        await expect(blogCategoryService.getBlogCategoryById(999)).rejects.toThrow(ApiError);
        await expect(blogCategoryService.getBlogCategoryById(999)).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'Blog category not found',
        });
    });

    test('should update a blog category by id', async () => {
        mockBlogCategoryRepository.getBlogCategoryById.mockResolvedValue({ id: 10 });
        mockBlogCategoryRepository.updateBlogCategoryById.mockResolvedValue({ id: 10, name: 'Updated' });

        const result = await blogCategoryService.updateBlogCategoryById(10, { name: 'Updated' });

        expect(mockBlogCategoryRepository.updateBlogCategoryById).toHaveBeenCalledWith(10, { name: 'Updated' });
        expect(result.name).toBe('Updated');
    });

    test('should delete a blog category by id', async () => {
        mockBlogCategoryRepository.getBlogCategoryById.mockResolvedValue({ id: 10 });
        mockBlogCategoryRepository.deleteBlogCategoryById.mockResolvedValue({ id: 10 });

        await blogCategoryService.deleteBlogCategoryById(10);

        expect(mockBlogCategoryRepository.deleteBlogCategoryById).toHaveBeenCalledWith(10);
    });
});

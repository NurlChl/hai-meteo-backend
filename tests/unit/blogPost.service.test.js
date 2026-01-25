import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockBlogPostRepository = {
    createBlogPost: jest.fn(),
    getBlogPosts: jest.fn(),
    getBlogPostById: jest.fn(),
    updateBlogPostById: jest.fn(),
    deleteBlogPostById: jest.fn(),
    replaceBlogPostCategories: jest.fn(),
    replaceBlogPostTags: jest.fn(),
    getBlogPostCategoryIds: jest.fn(),
    getBlogPostTagIds: jest.fn(),
};

const mockBlogCategoryRepository = {
    getBlogCategoriesByIds: jest.fn(),
};

const mockBlogTagRepository = {
    getBlogTagsByIds: jest.fn(),
};

const mockMediaAssetService = {
    getMediaAssetById: jest.fn(),
};

jest.unstable_mockModule('../../src/features/blogPost/blogPost.repository.js', () => mockBlogPostRepository);
jest.unstable_mockModule('../../src/features/blogCategory/blogCategory.repository.js', () => mockBlogCategoryRepository);
jest.unstable_mockModule('../../src/features/blogTag/blogTag.repository.js', () => mockBlogTagRepository);
jest.unstable_mockModule('../../src/features/mediaAsset/mediaAsset.service.js', () => mockMediaAssetService);

const blogPostService = await import('../../src/features/blogPost/blogPost.service.js');

describe('Blog Post Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a blog post with relations and publishedAt', async () => {
        mockBlogCategoryRepository.getBlogCategoriesByIds.mockResolvedValue([{ id: 1 }]);
        mockBlogTagRepository.getBlogTagsByIds.mockResolvedValue([{ id: 2 }]);
        mockBlogPostRepository.createBlogPost.mockImplementation((data) => ({ id: 10, ...data }));
        mockBlogPostRepository.getBlogPostCategoryIds.mockResolvedValue([1]);
        mockBlogPostRepository.getBlogPostTagIds.mockResolvedValue([2]);

        const result = await blogPostService.createBlogPost({
            slug: 'weekly-weather',
            title: 'Weekly Weather',
            contentMd: '# Weather',
            status: 'published',
            categoryIds: [1],
            tagIds: [2],
        });

        expect(mockBlogPostRepository.createBlogPost).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 'published',
                publishedAt: expect.any(Date),
            })
        );
        expect(mockBlogPostRepository.replaceBlogPostCategories).toHaveBeenCalledWith(10, [1]);
        expect(mockBlogPostRepository.replaceBlogPostTags).toHaveBeenCalledWith(10, [2]);
        expect(result.categoryIds).toEqual([1]);
        expect(result.tagIds).toEqual([2]);
    });

    test('should throw error when blog categories are missing', async () => {
        mockBlogCategoryRepository.getBlogCategoriesByIds.mockResolvedValue([]);
        mockBlogTagRepository.getBlogTagsByIds.mockResolvedValue([{ id: 2 }]);

        await expect(
            blogPostService.createBlogPost({
                slug: 'weekly-weather',
                title: 'Weekly Weather',
                contentMd: '# Weather',
                categoryIds: [1],
                tagIds: [2],
            })
        ).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'One or more blog categories not found',
        });
    });

    test('should throw error when blog tags are missing', async () => {
        mockBlogCategoryRepository.getBlogCategoriesByIds.mockResolvedValue([{ id: 1 }]);
        mockBlogTagRepository.getBlogTagsByIds.mockResolvedValue([]);

        await expect(
            blogPostService.createBlogPost({
                slug: 'weekly-weather',
                title: 'Weekly Weather',
                contentMd: '# Weather',
                categoryIds: [1],
                tagIds: [2],
            })
        ).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'One or more blog tags not found',
        });
    });

    test('should validate cover media asset when provided', async () => {
        mockMediaAssetService.getMediaAssetById.mockResolvedValue({ id: 99 });
        mockBlogPostRepository.createBlogPost.mockImplementation((data) => ({ id: 12, ...data }));
        mockBlogPostRepository.getBlogPostCategoryIds.mockResolvedValue([]);
        mockBlogPostRepository.getBlogPostTagIds.mockResolvedValue([]);

        await blogPostService.createBlogPost({
            slug: 'monthly-weather',
            title: 'Monthly Weather',
            contentMd: '# Monthly Weather',
            coverMediaId: 99,
        });

        expect(mockMediaAssetService.getMediaAssetById).toHaveBeenCalledWith(99);
        expect(mockBlogPostRepository.createBlogPost).toHaveBeenCalledWith(
            expect.objectContaining({ coverMediaId: 99 })
        );
    });

    test('should return null when repository returns null post', async () => {
        mockBlogPostRepository.createBlogPost.mockResolvedValue(null);

        const result = await blogPostService.createBlogPost({
            slug: 'daily-weather',
            title: 'Daily Weather',
            contentMd: '# Weather',
        });

        expect(result).toBeNull();
        expect(mockBlogPostRepository.getBlogPostCategoryIds).not.toHaveBeenCalled();
        expect(mockBlogPostRepository.getBlogPostTagIds).not.toHaveBeenCalled();
    });

    test('should set publishedAt when updating to published', async () => {
        mockBlogPostRepository.getBlogPostById.mockResolvedValue({ id: 5 });
        mockBlogPostRepository.getBlogPostCategoryIds.mockResolvedValue([]);
        mockBlogPostRepository.getBlogPostTagIds.mockResolvedValue([]);
        mockBlogPostRepository.updateBlogPostById.mockImplementation((id, data) => ({ id, ...data }));

        const result = await blogPostService.updateBlogPostById(5, { status: 'published' });

        expect(mockBlogPostRepository.updateBlogPostById).toHaveBeenCalledWith(
            5,
            expect.objectContaining({ publishedAt: expect.any(Date) })
        );
        expect(result.status).toBe('published');
    });

    test('should update blog post with relations and cover media validation', async () => {
        mockBlogPostRepository.getBlogPostById.mockResolvedValue({ id: 7 });
        mockBlogPostRepository.getBlogPostCategoryIds.mockResolvedValue([1]);
        mockBlogPostRepository.getBlogPostTagIds.mockResolvedValue([2]);
        mockBlogPostRepository.updateBlogPostById.mockImplementation((id, data) => ({ id, ...data }));
        mockBlogPostRepository.replaceBlogPostCategories.mockResolvedValue();
        mockBlogPostRepository.replaceBlogPostTags.mockResolvedValue();
        mockMediaAssetService.getMediaAssetById.mockResolvedValue({ id: 55 });
        mockBlogCategoryRepository.getBlogCategoriesByIds.mockResolvedValue([{ id: 1 }]);
        mockBlogTagRepository.getBlogTagsByIds.mockResolvedValue([{ id: 2 }]);

        const result = await blogPostService.updateBlogPostById(7, {
            coverMediaId: 55,
            categoryIds: [1],
            tagIds: [2],
        });

        expect(mockMediaAssetService.getMediaAssetById).toHaveBeenCalledWith(55);
        expect(mockBlogPostRepository.replaceBlogPostCategories).toHaveBeenCalledWith(7, [1]);
        expect(mockBlogPostRepository.replaceBlogPostTags).toHaveBeenCalledWith(7, [2]);
        expect(result.id).toBe(7);
    });

    test('should throw error when blog post is not found', async () => {
        mockBlogPostRepository.getBlogPostById.mockResolvedValue(null);

        await expect(blogPostService.getBlogPostById(999)).rejects.toThrow(ApiError);
        await expect(blogPostService.getBlogPostById(999)).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'Blog post not found',
        });
    });
});

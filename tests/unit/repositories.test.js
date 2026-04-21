import { jest } from '@jest/globals';

const mockDb = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
};

jest.unstable_mockModule('../../src/shared/config/database.js', () => ({
    default: mockDb,
}));

const authRepository = await import('../../src/features/auth/auth.repository.js');
const blogCategoryRepository = await import('../../src/features/blogCategory/blogCategory.repository.js');
const blogTagRepository = await import('../../src/features/blogTag/blogTag.repository.js');
const blogPostRepository = await import('../../src/features/blogPost/blogPost.repository.js');
const contactMessageRepository = await import('../../src/features/contactMessage/contactMessage.repository.js');
const faqRepository = await import('../../src/features/faq/faq.repository.js');
const mediaAssetRepository = await import('../../src/features/mediaAsset/mediaAsset.repository.js');
const navigationItemRepository = await import('../../src/features/navigationItem/navigationItem.repository.js');
const pageRepository = await import('../../src/features/page/page.repository.js');
const pageSectionRepository = await import('../../src/features/pageSection/pageSection.repository.js');

const setupListCountMocks = ({ results = [], totalCount = 0 } = {}) => {
    const listQuery = {
        where: jest.fn(() => listQuery),
        orderBy: jest.fn(() => listQuery),
        limit: jest.fn(() => ({
            offset: jest.fn(() => results),
        })),
    };
    const countResults = [{ count: totalCount }];
    const countQuery = {
        where: jest.fn(() => countResults),
        then: (resolve) => Promise.resolve(countResults).then(resolve),
    };
    const listFrom = jest.fn(() => listQuery);
    const countFrom = jest.fn(() => countQuery);
    mockDb.select.mockImplementation((arg) => (arg ? { from: countFrom } : { from: listFrom }));
    return { listQuery, countQuery };
};

const setupSelectWhereMock = (results) => {
    const where = jest.fn().mockResolvedValue(results);
    const from = jest.fn(() => ({ where }));
    mockDb.select.mockReturnValue({ from });
    return { where, from };
};

describe('Repository modules', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockDb.select.mockReset();
        mockDb.insert.mockReset();
        mockDb.update.mockReset();
        mockDb.delete.mockReset();
    });

    test('auth repository should fetch user by id', async () => {
        setupSelectWhereMock([{ id: 1, email: 'test@example.com' }]);

        const result = await authRepository.getUserById(1);

        expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });

    test('blog category repository should list categories', async () => {
        setupListCountMocks({ results: [{ id: 1 }], totalCount: 1 });

        const result = await blogCategoryRepository.getBlogCategories({ limit: 1, offset: 0 });

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('blog category repository should list categories with defaults', async () => {
        setupListCountMocks({ results: [{ id: 2 }], totalCount: 1 });

        const result = await blogCategoryRepository.getBlogCategories();

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('blog category repository should return empty list for missing ids', async () => {
        const result = await blogCategoryRepository.getBlogCategoriesByIds([]);

        expect(result).toEqual([]);
        expect(mockDb.select).not.toHaveBeenCalled();
    });

    test('blog category repository should fetch categories by ids', async () => {
        setupSelectWhereMock([{ id: 1 }]);

        const result = await blogCategoryRepository.getBlogCategoriesByIds([1]);

        expect(result).toEqual([{ id: 1 }]);
    });

    test('blog tag repository should list tags', async () => {
        setupListCountMocks({ results: [{ id: 2 }], totalCount: 1 });

        const result = await blogTagRepository.getBlogTags({ limit: 1, offset: 0 });

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('blog tag repository should list tags with defaults', async () => {
        setupListCountMocks({ results: [{ id: 4 }], totalCount: 1 });

        const result = await blogTagRepository.getBlogTags();

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('blog tag repository should return empty list for missing ids', async () => {
        const result = await blogTagRepository.getBlogTagsByIds();

        expect(result).toEqual([]);
        expect(mockDb.select).not.toHaveBeenCalled();
    });

    test('blog tag repository should fetch tags by ids', async () => {
        setupSelectWhereMock([{ id: 3 }]);

        const result = await blogTagRepository.getBlogTagsByIds([3]);

        expect(result).toEqual([{ id: 3 }]);
    });

    test('blog post repository should list posts with status filter', async () => {
        setupListCountMocks({ results: [{ id: 5, status: 'published' }], totalCount: 1 });

        const result = await blogPostRepository.getBlogPosts({ status: 'published', limit: 1, offset: 0 });

        expect(result.results).toHaveLength(1);
        expect(result.results[0].status).toBe('published');
    });

    test('blog post repository should list posts with defaults', async () => {
        setupListCountMocks({ results: [{ id: 6, status: 'draft' }], totalCount: 1 });

        const result = await blogPostRepository.getBlogPosts();

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('blog post repository should replace categories when provided', async () => {
        const mockDelete = { where: jest.fn().mockResolvedValue([]) };
        const mockInsert = { values: jest.fn().mockResolvedValue([]) };
        mockDb.delete.mockReturnValue(mockDelete);
        mockDb.insert.mockReturnValue(mockInsert);

        await blogPostRepository.replaceBlogPostCategories(10, [1, 2]);

        expect(mockDb.delete).toHaveBeenCalled();
        expect(mockDb.insert).toHaveBeenCalled();
        expect(mockInsert.values).toHaveBeenCalledWith([
            { postId: 10, categoryId: 1 },
            { postId: 10, categoryId: 2 },
        ]);
    });

    test('blog post repository should skip category insert when empty', async () => {
        const mockDelete = { where: jest.fn().mockResolvedValue([]) };
        mockDb.delete.mockReturnValue(mockDelete);
        mockDb.insert.mockReturnValue({ values: jest.fn().mockResolvedValue([]) });

        await blogPostRepository.replaceBlogPostCategories(10, []);

        expect(mockDb.delete).toHaveBeenCalled();
        expect(mockDb.insert).not.toHaveBeenCalled();
    });

    test('blog post repository should replace tags when provided', async () => {
        const mockDelete = { where: jest.fn().mockResolvedValue([]) };
        const mockInsert = { values: jest.fn().mockResolvedValue([]) };
        mockDb.delete.mockReturnValue(mockDelete);
        mockDb.insert.mockReturnValue(mockInsert);

        await blogPostRepository.replaceBlogPostTags(10, [4]);

        expect(mockDb.delete).toHaveBeenCalled();
        expect(mockDb.insert).toHaveBeenCalled();
        expect(mockInsert.values).toHaveBeenCalledWith([{ postId: 10, tagId: 4 }]);
    });

    test('blog post repository should skip tag insert when empty', async () => {
        const mockDelete = { where: jest.fn().mockResolvedValue([]) };
        mockDb.delete.mockReturnValue(mockDelete);
        mockDb.insert.mockReturnValue({ values: jest.fn().mockResolvedValue([]) });

        await blogPostRepository.replaceBlogPostTags(10, []);

        expect(mockDb.delete).toHaveBeenCalled();
        expect(mockDb.insert).not.toHaveBeenCalled();
    });

    test('contact message repository should list messages with status filter', async () => {
        setupListCountMocks({ results: [{ id: 1, status: 'new' }], totalCount: 1 });

        const result = await contactMessageRepository.getContactMessages({ status: 'new' });

        expect(result.results).toHaveLength(1);
        expect(result.results[0].status).toBe('new');
    });

    test('contact message repository should list messages without filter', async () => {
        setupListCountMocks({ results: [{ id: 1 }], totalCount: 1 });

        const result = await contactMessageRepository.getContactMessages();

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('faq repository should list faqs with published filter', async () => {
        setupListCountMocks({ results: [{ id: 1, isPublished: true }], totalCount: 1 });

        const result = await faqRepository.getFaqs({ isPublished: true });

        expect(result.results).toHaveLength(1);
        expect(result.results[0].isPublished).toBe(true);
    });

    test('faq repository should list faqs without boolean filter', async () => {
        setupListCountMocks({ results: [{ id: 1 }], totalCount: 1 });

        const result = await faqRepository.getFaqs({ isPublished: 'true' });

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('faq repository should list faqs with defaults', async () => {
        setupListCountMocks({ results: [{ id: 2 }], totalCount: 1 });

        const result = await faqRepository.getFaqs();

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('media asset repository should list media assets', async () => {
        setupListCountMocks({ results: [{ id: 1 }], totalCount: 1 });

        const result = await mediaAssetRepository.getMediaAssets({ limit: 1, offset: 0 });

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('media asset repository should list media assets with defaults', async () => {
        setupListCountMocks({ results: [{ id: 2 }], totalCount: 1 });

        const result = await mediaAssetRepository.getMediaAssets();

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('navigation item repository should list items with filters', async () => {
        setupListCountMocks({ results: [{ id: 1 }], totalCount: 1 });

        const result = await navigationItemRepository.getNavigationItems({ location: 'header', isEnabled: true });

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('navigation item repository should list items without filters', async () => {
        setupListCountMocks({ results: [{ id: 2 }], totalCount: 1 });

        const result = await navigationItemRepository.getNavigationItems();

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('page repository should list pages with filters', async () => {
        setupListCountMocks({ results: [{ id: 1, slug: 'home' }], totalCount: 1 });

        const result = await pageRepository.getPages({ slug: 'home', isPublished: true });

        expect(result.results).toHaveLength(1);
        expect(result.results[0].slug).toBe('home');
    });

    test('page repository should list pages without filters', async () => {
        setupListCountMocks({ results: [{ id: 2 }], totalCount: 1 });

        const result = await pageRepository.getPages();

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });

    test('page section repository should list sections with filters', async () => {
        setupListCountMocks({ results: [{ id: 1, pageId: 2 }], totalCount: 1 });

        const result = await pageSectionRepository.getPageSections({ pageId: 2, isEnabled: true });

        expect(result.results).toHaveLength(1);
        expect(result.results[0].pageId).toBe(2);
    });

    test('page section repository should list sections without filters', async () => {
        setupListCountMocks({ results: [{ id: 2 }], totalCount: 1 });

        const result = await pageSectionRepository.getPageSections();

        expect(result.results).toHaveLength(1);
        expect(result.totalResults).toBe(1);
    });
});

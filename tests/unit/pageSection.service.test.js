import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockPageSectionRepository = {
    createPageSection: jest.fn(),
    getPageSections: jest.fn(),
    getPageSectionById: jest.fn(),
    updatePageSectionById: jest.fn(),
    deletePageSectionById: jest.fn(),
};

const mockPageService = {
    getPageById: jest.fn(),
};

jest.unstable_mockModule('../../src/features/pageSection/pageSection.repository.js', () => mockPageSectionRepository);
jest.unstable_mockModule('../../src/features/page/page.service.js', () => mockPageService);

const pageSectionService = await import('../../src/features/pageSection/pageSection.service.js');

describe('Page Section Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a page section and validate page reference', async () => {
        mockPageService.getPageById.mockResolvedValue({ id: 1 });
        mockPageSectionRepository.createPageSection.mockResolvedValue({ id: 10 });

        await pageSectionService.createPageSection({
            pageId: 1,
            sectionKey: 'hero',
            content: { heading: 'Hello' },
        });

        expect(mockPageService.getPageById).toHaveBeenCalledWith(1);
        expect(mockPageSectionRepository.createPageSection).toHaveBeenCalled();
    });

    test('should create a page section without optional content', async () => {
        mockPageService.getPageById.mockResolvedValue({ id: 1 });
        mockPageSectionRepository.createPageSection.mockResolvedValue({ id: 11 });

        await pageSectionService.createPageSection({
            pageId: 1,
            sectionKey: 'intro',
        });

        expect(mockPageSectionRepository.createPageSection).toHaveBeenCalled();
    });

    test('should update a page section', async () => {
        mockPageSectionRepository.getPageSectionById.mockResolvedValue({ id: 10 });
        mockPageSectionRepository.updatePageSectionById.mockResolvedValue({ id: 10, sortOrder: 3 });

        await pageSectionService.updatePageSectionById(10, { sortOrder: 3 });

        expect(mockPageSectionRepository.updatePageSectionById).toHaveBeenCalledWith(10, { sortOrder: 3 });
    });

    test('should update a page section with page validation', async () => {
        mockPageSectionRepository.getPageSectionById.mockResolvedValue({ id: 12 });
        mockPageSectionRepository.updatePageSectionById.mockResolvedValue({ id: 12, pageId: 2 });
        mockPageService.getPageById.mockResolvedValue({ id: 2 });

        await pageSectionService.updatePageSectionById(12, { pageId: 2 });

        expect(mockPageService.getPageById).toHaveBeenCalledWith(2);
        expect(mockPageSectionRepository.updatePageSectionById).toHaveBeenCalledWith(12, {
            pageId: 2,
        });
    });

    test('should throw error when page section is not found', async () => {
        mockPageSectionRepository.getPageSectionById.mockResolvedValue(null);

        await expect(pageSectionService.getPageSectionById(999)).rejects.toThrow(ApiError);
        await expect(pageSectionService.getPageSectionById(999)).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'Page section not found',
        });
    });
});

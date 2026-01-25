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

const mockMediaAssetService = {
    getMediaAssetById: jest.fn(),
};

jest.unstable_mockModule('../../src/features/pageSection/pageSection.repository.js', () => mockPageSectionRepository);
jest.unstable_mockModule('../../src/features/page/page.service.js', () => mockPageService);
jest.unstable_mockModule('../../src/features/mediaAsset/mediaAsset.service.js', () => mockMediaAssetService);

const pageSectionService = await import('../../src/features/pageSection/pageSection.service.js');

describe('Page Section Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create a page section and validate references', async () => {
        mockPageService.getPageById.mockResolvedValue({ id: 1 });
        mockMediaAssetService.getMediaAssetById.mockResolvedValue({ id: 2 });
        mockPageSectionRepository.createPageSection.mockResolvedValue({ id: 10 });

        await pageSectionService.createPageSection({
            pageId: 1,
            sectionKey: 'hero',
            sectionType: 'hero',
            backgroundMediaId: 2,
        });

        expect(mockPageService.getPageById).toHaveBeenCalledWith(1);
        expect(mockMediaAssetService.getMediaAssetById).toHaveBeenCalledWith(2);
        expect(mockPageSectionRepository.createPageSection).toHaveBeenCalled();
    });

    test('should create a page section without background media', async () => {
        mockPageService.getPageById.mockResolvedValue({ id: 1 });
        mockPageSectionRepository.createPageSection.mockResolvedValue({ id: 11 });

        await pageSectionService.createPageSection({
            pageId: 1,
            sectionKey: 'intro',
            sectionType: 'intro',
        });

        expect(mockMediaAssetService.getMediaAssetById).not.toHaveBeenCalled();
        expect(mockPageSectionRepository.createPageSection).toHaveBeenCalled();
    });

    test('should update a page section without calling media asset for null', async () => {
        mockPageSectionRepository.getPageSectionById.mockResolvedValue({ id: 10 });
        mockPageSectionRepository.updatePageSectionById.mockResolvedValue({ id: 10, backgroundMediaId: null });

        await pageSectionService.updatePageSectionById(10, { backgroundMediaId: null });

        expect(mockMediaAssetService.getMediaAssetById).not.toHaveBeenCalled();
        expect(mockPageSectionRepository.updatePageSectionById).toHaveBeenCalledWith(10, { backgroundMediaId: null });
    });

    test('should update a page section with page and background media validation', async () => {
        mockPageSectionRepository.getPageSectionById.mockResolvedValue({ id: 12 });
        mockPageSectionRepository.updatePageSectionById.mockResolvedValue({ id: 12, pageId: 2, backgroundMediaId: 3 });
        mockPageService.getPageById.mockResolvedValue({ id: 2 });
        mockMediaAssetService.getMediaAssetById.mockResolvedValue({ id: 3 });

        await pageSectionService.updatePageSectionById(12, { pageId: 2, backgroundMediaId: 3 });

        expect(mockPageService.getPageById).toHaveBeenCalledWith(2);
        expect(mockMediaAssetService.getMediaAssetById).toHaveBeenCalledWith(3);
        expect(mockPageSectionRepository.updatePageSectionById).toHaveBeenCalledWith(12, {
            pageId: 2,
            backgroundMediaId: 3,
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

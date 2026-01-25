import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockNavigationItemRepository = {
    createNavigationItem: jest.fn(),
    getNavigationItems: jest.fn(),
    getNavigationItemById: jest.fn(),
    updateNavigationItemById: jest.fn(),
    deleteNavigationItemById: jest.fn(),
};

const mockMediaAssetService = {
    getMediaAssetById: jest.fn(),
};

jest.unstable_mockModule('../../src/features/navigationItem/navigationItem.repository.js', () => mockNavigationItemRepository);
jest.unstable_mockModule('../../src/features/mediaAsset/mediaAsset.service.js', () => mockMediaAssetService);

const navigationItemService = await import('../../src/features/navigationItem/navigationItem.service.js');

describe('Navigation Item Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should create navigation item with icon validation', async () => {
        mockMediaAssetService.getMediaAssetById.mockResolvedValue({ id: 1 });
        mockNavigationItemRepository.createNavigationItem.mockResolvedValue({ id: 10 });

        await navigationItemService.createNavigationItem({
            location: 'header',
            label: 'Features',
            href: '/features',
            iconMediaId: 1,
        });

        expect(mockMediaAssetService.getMediaAssetById).toHaveBeenCalledWith(1);
        expect(mockNavigationItemRepository.createNavigationItem).toHaveBeenCalled();
    });

    test('should update navigation item without icon validation for null', async () => {
        mockNavigationItemRepository.getNavigationItemById.mockResolvedValue({ id: 10 });
        mockNavigationItemRepository.updateNavigationItemById.mockResolvedValue({ id: 10, iconMediaId: null });

        await navigationItemService.updateNavigationItemById(10, { iconMediaId: null });

        expect(mockMediaAssetService.getMediaAssetById).not.toHaveBeenCalled();
        expect(mockNavigationItemRepository.updateNavigationItemById).toHaveBeenCalledWith(10, { iconMediaId: null });
    });

    test('should update navigation item with icon validation', async () => {
        mockNavigationItemRepository.getNavigationItemById.mockResolvedValue({ id: 10 });
        mockNavigationItemRepository.updateNavigationItemById.mockResolvedValue({ id: 10, iconMediaId: 3 });
        mockMediaAssetService.getMediaAssetById.mockResolvedValue({ id: 3 });

        await navigationItemService.updateNavigationItemById(10, { iconMediaId: 3 });

        expect(mockMediaAssetService.getMediaAssetById).toHaveBeenCalledWith(3);
        expect(mockNavigationItemRepository.updateNavigationItemById).toHaveBeenCalledWith(10, { iconMediaId: 3 });
    });

    test('should throw error when navigation item is not found', async () => {
        mockNavigationItemRepository.getNavigationItemById.mockResolvedValue(null);

        await expect(navigationItemService.getNavigationItemById(999)).rejects.toThrow(ApiError);
        await expect(navigationItemService.getNavigationItemById(999)).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'Navigation item not found',
        });
    });
});

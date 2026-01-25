import { jest } from '@jest/globals';
import httpStatus from 'http-status';
import ApiError from '../../src/shared/utils/ApiError.js';

const mockMediaAssetRepository = {
    createMediaAsset: jest.fn(),
    getMediaAssets: jest.fn(),
    getMediaAssetById: jest.fn(),
    updateMediaAssetById: jest.fn(),
    deleteMediaAssetById: jest.fn(),
};

jest.unstable_mockModule('../../src/features/mediaAsset/mediaAsset.repository.js', () => mockMediaAssetRepository);

const mediaAssetService = await import('../../src/features/mediaAsset/mediaAsset.service.js');

describe('Media Asset Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should throw error when media asset is not found', async () => {
        mockMediaAssetRepository.getMediaAssetById.mockResolvedValue(null);

        await expect(mediaAssetService.getMediaAssetById(999)).rejects.toThrow(ApiError);
        await expect(mediaAssetService.getMediaAssetById(999)).rejects.toMatchObject({
            statusCode: httpStatus.NOT_FOUND,
            message: 'Media asset not found',
        });
    });
});

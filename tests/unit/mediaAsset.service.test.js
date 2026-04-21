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

const mockStorage = {
    resolveStoredFileUrl: jest.fn(),
};

jest.unstable_mockModule('../../src/features/mediaAsset/mediaAsset.repository.js', () => mockMediaAssetRepository);
jest.unstable_mockModule('../../src/shared/config/storage.js', () => mockStorage);

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

    test('should return signed file urls when listing media assets', async () => {
        mockMediaAssetRepository.getMediaAssets.mockResolvedValue({
            results: [
                { id: 1, fileUrl: 'media-assets/2024/04/sample.png', altText: 'Sample' },
                { id: 2, fileUrl: 'https://cdn.example.com/banner.png', altText: 'Banner' },
            ],
            totalResults: 2,
            limit: 10,
            offset: 0,
        });
        mockStorage.resolveStoredFileUrl
            .mockResolvedValueOnce('https://signed.example.com/sample.png')
            .mockResolvedValueOnce('https://cdn.example.com/banner.png');

        const result = await mediaAssetService.getMediaAssets({ limit: 10, offset: 0 });

        expect(result.results[0].fileUrl).toBe('https://signed.example.com/sample.png');
        expect(result.results[1].fileUrl).toBe('https://cdn.example.com/banner.png');
    });

    test('should return a signed file url when fetching a media asset by id', async () => {
        mockMediaAssetRepository.getMediaAssetById.mockResolvedValue({
            id: 10,
            fileUrl: 'media-assets/2024/04/sample.mp4',
            altText: 'Video',
        });
        mockStorage.resolveStoredFileUrl.mockResolvedValue('https://signed.example.com/sample.mp4');

        const result = await mediaAssetService.getMediaAssetById(10);

        expect(result.fileUrl).toBe('https://signed.example.com/sample.mp4');
    });
});

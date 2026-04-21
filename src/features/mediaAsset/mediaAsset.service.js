import httpStatus from 'http-status';
import * as mediaAssetRepository from './mediaAsset.repository.js';
import ApiError from '../../shared/utils/ApiError.js';
import { resolveStoredFileUrl } from '../../shared/config/storage.js';

const serializeMediaAsset = async (mediaAsset) => {
    if (!mediaAsset) {
        return mediaAsset;
    }

    return {
        ...mediaAsset,
        fileUrl: await resolveStoredFileUrl(mediaAsset.fileUrl),
    };
};

const createMediaAsset = async (mediaAssetBody) => {
    const mediaAsset = await mediaAssetRepository.createMediaAsset(mediaAssetBody);
    return serializeMediaAsset(mediaAsset);
};

const getMediaAssets = async (filter) => {
    const result = await mediaAssetRepository.getMediaAssets(filter);
    return {
        ...result,
        results: await Promise.all(result.results.map(serializeMediaAsset)),
    };
};

const getMediaAssetById = async (id) => {
    const mediaAsset = await mediaAssetRepository.getMediaAssetById(id);
    if (!mediaAsset) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Media asset not found');
    }
    return serializeMediaAsset(mediaAsset);
};

const updateMediaAssetById = async (id, updateBody) => {
    await getMediaAssetById(id);
    const mediaAsset = await mediaAssetRepository.updateMediaAssetById(id, updateBody);
    return serializeMediaAsset(mediaAsset);
};

const deleteMediaAssetById = async (id) => {
    await getMediaAssetById(id);
    return mediaAssetRepository.deleteMediaAssetById(id);
};

export {
    createMediaAsset,
    getMediaAssets,
    getMediaAssetById,
    updateMediaAssetById,
    deleteMediaAssetById,
};

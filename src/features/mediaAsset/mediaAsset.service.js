import httpStatus from 'http-status';
import * as mediaAssetRepository from './mediaAsset.repository.js';
import ApiError from '../../shared/utils/ApiError.js';

const createMediaAsset = (mediaAssetBody) => {
    return mediaAssetRepository.createMediaAsset(mediaAssetBody);
};

const getMediaAssets = (filter) => {
    return mediaAssetRepository.getMediaAssets(filter);
};

const getMediaAssetById = async (id) => {
    const mediaAsset = await mediaAssetRepository.getMediaAssetById(id);
    if (!mediaAsset) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Media asset not found');
    }
    return mediaAsset;
};

const updateMediaAssetById = async (id, updateBody) => {
    await getMediaAssetById(id);
    return mediaAssetRepository.updateMediaAssetById(id, updateBody);
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

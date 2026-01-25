import httpStatus from 'http-status';
import * as navigationItemRepository from './navigationItem.repository.js';
import ApiError from '../../shared/utils/ApiError.js';
import * as mediaAssetService from '../mediaAsset/mediaAsset.service.js';

const createNavigationItem = async (itemBody) => {
    if (itemBody.iconMediaId !== undefined && itemBody.iconMediaId !== null) {
        await mediaAssetService.getMediaAssetById(itemBody.iconMediaId);
    }
    return navigationItemRepository.createNavigationItem(itemBody);
};

const getNavigationItems = (filter) => {
    return navigationItemRepository.getNavigationItems(filter);
};

const getNavigationItemById = async (id) => {
    const item = await navigationItemRepository.getNavigationItemById(id);
    if (!item) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Navigation item not found');
    }
    return item;
};

const updateNavigationItemById = async (id, updateBody) => {
    await getNavigationItemById(id);
    if (updateBody.iconMediaId !== undefined && updateBody.iconMediaId !== null) {
        await mediaAssetService.getMediaAssetById(updateBody.iconMediaId);
    }
    return navigationItemRepository.updateNavigationItemById(id, updateBody);
};

const deleteNavigationItemById = async (id) => {
    await getNavigationItemById(id);
    return navigationItemRepository.deleteNavigationItemById(id);
};

export {
    createNavigationItem,
    getNavigationItems,
    getNavigationItemById,
    updateNavigationItemById,
    deleteNavigationItemById,
};

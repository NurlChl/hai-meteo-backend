import httpStatus from 'http-status';
import * as pageSectionRepository from './pageSection.repository.js';
import * as pageService from '../page/page.service.js';
import * as mediaAssetService from '../mediaAsset/mediaAsset.service.js';
import ApiError from '../../shared/utils/ApiError.js';

const createPageSection = async (sectionBody) => {
    await pageService.getPageById(sectionBody.pageId);
    if (sectionBody.backgroundMediaId !== undefined && sectionBody.backgroundMediaId !== null) {
        await mediaAssetService.getMediaAssetById(sectionBody.backgroundMediaId);
    }
    return pageSectionRepository.createPageSection(sectionBody);
};

const getPageSections = (filter) => {
    return pageSectionRepository.getPageSections(filter);
};

const getPageSectionById = async (id) => {
    const section = await pageSectionRepository.getPageSectionById(id);
    if (!section) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Page section not found');
    }
    return section;
};

const updatePageSectionById = async (id, updateBody) => {
    await getPageSectionById(id);
    if (updateBody.pageId) {
        await pageService.getPageById(updateBody.pageId);
    }
    if (updateBody.backgroundMediaId !== undefined && updateBody.backgroundMediaId !== null) {
        await mediaAssetService.getMediaAssetById(updateBody.backgroundMediaId);
    }
    return pageSectionRepository.updatePageSectionById(id, updateBody);
};

const deletePageSectionById = async (id) => {
    await getPageSectionById(id);
    return pageSectionRepository.deletePageSectionById(id);
};

export {
    createPageSection,
    getPageSections,
    getPageSectionById,
    updatePageSectionById,
    deletePageSectionById,
};

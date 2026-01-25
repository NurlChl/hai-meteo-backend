import httpStatus from 'http-status';
import * as pageRepository from './page.repository.js';
import ApiError from '../../shared/utils/ApiError.js';

const createPage = (pageBody) => {
    return pageRepository.createPage(pageBody);
};

const getPages = (filter) => {
    return pageRepository.getPages(filter);
};

const getPageById = async (id) => {
    const page = await pageRepository.getPageById(id);
    if (!page) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
    }
    return page;
};

const getPageBySlug = async (slug) => {
    const page = await pageRepository.getPageBySlug(slug);
    if (!page) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Page not found');
    }
    return page;
};

const updatePageById = async (id, updateBody) => {
    await getPageById(id);
    return pageRepository.updatePageById(id, updateBody);
};

const deletePageById = async (id) => {
    await getPageById(id);
    return pageRepository.deletePageById(id);
};

export {
    createPage,
    getPages,
    getPageById,
    getPageBySlug,
    updatePageById,
    deletePageById,
};

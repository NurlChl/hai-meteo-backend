import httpStatus from 'http-status';
import * as blogTagRepository from './blogTag.repository.js';
import ApiError from '../../shared/utils/ApiError.js';

const createBlogTag = (tagBody) => {
    return blogTagRepository.createBlogTag(tagBody);
};

const getBlogTags = (filter) => {
    return blogTagRepository.getBlogTags(filter);
};

const getBlogTagById = async (id) => {
    const tag = await blogTagRepository.getBlogTagById(id);
    if (!tag) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog tag not found');
    }
    return tag;
};

const updateBlogTagById = async (id, updateBody) => {
    await getBlogTagById(id);
    return blogTagRepository.updateBlogTagById(id, updateBody);
};

const deleteBlogTagById = async (id) => {
    await getBlogTagById(id);
    return blogTagRepository.deleteBlogTagById(id);
};

export {
    createBlogTag,
    getBlogTags,
    getBlogTagById,
    updateBlogTagById,
    deleteBlogTagById,
};

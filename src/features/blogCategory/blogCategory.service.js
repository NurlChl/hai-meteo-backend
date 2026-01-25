import httpStatus from 'http-status';
import * as blogCategoryRepository from './blogCategory.repository.js';
import ApiError from '../../shared/utils/ApiError.js';

const createBlogCategory = (categoryBody) => {
    return blogCategoryRepository.createBlogCategory(categoryBody);
};

const getBlogCategories = (filter) => {
    return blogCategoryRepository.getBlogCategories(filter);
};

const getBlogCategoryById = async (id) => {
    const category = await blogCategoryRepository.getBlogCategoryById(id);
    if (!category) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog category not found');
    }
    return category;
};

const updateBlogCategoryById = async (id, updateBody) => {
    await getBlogCategoryById(id);
    return blogCategoryRepository.updateBlogCategoryById(id, updateBody);
};

const deleteBlogCategoryById = async (id) => {
    await getBlogCategoryById(id);
    return blogCategoryRepository.deleteBlogCategoryById(id);
};

export {
    createBlogCategory,
    getBlogCategories,
    getBlogCategoryById,
    updateBlogCategoryById,
    deleteBlogCategoryById,
};

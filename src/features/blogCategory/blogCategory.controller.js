import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as blogCategoryService from './blogCategory.service.js';
import pick from '../../shared/utils/pick.js';

const createBlogCategory = catchAsync(async (req, res) => {
    const category = await blogCategoryService.createBlogCategory(req.body);
    res.status(httpStatus.CREATED).send(category);
});

const getBlogCategories = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset', 'search']);
    const result = await blogCategoryService.getBlogCategories(filter);
    res.send(result);
});

const getBlogCategory = catchAsync(async (req, res) => {
    const category = await blogCategoryService.getBlogCategoryById(req.params.blogCategoryId);
    res.send(category);
});

const updateBlogCategory = catchAsync(async (req, res) => {
    const category = await blogCategoryService.updateBlogCategoryById(req.params.blogCategoryId, req.body);
    res.send(category);
});

const deleteBlogCategory = catchAsync(async (req, res) => {
    await blogCategoryService.deleteBlogCategoryById(req.params.blogCategoryId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createBlogCategory,
    getBlogCategories,
    getBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
};

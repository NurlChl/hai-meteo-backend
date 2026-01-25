import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as blogTagService from './blogTag.service.js';
import pick from '../../shared/utils/pick.js';

const createBlogTag = catchAsync(async (req, res) => {
    const tag = await blogTagService.createBlogTag(req.body);
    res.status(httpStatus.CREATED).send(tag);
});

const getBlogTags = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset', 'search']);
    const result = await blogTagService.getBlogTags(filter);
    res.send(result);
});

const getBlogTag = catchAsync(async (req, res) => {
    const tag = await blogTagService.getBlogTagById(req.params.blogTagId);
    res.send(tag);
});

const updateBlogTag = catchAsync(async (req, res) => {
    const tag = await blogTagService.updateBlogTagById(req.params.blogTagId, req.body);
    res.send(tag);
});

const deleteBlogTag = catchAsync(async (req, res) => {
    await blogTagService.deleteBlogTagById(req.params.blogTagId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createBlogTag,
    getBlogTags,
    getBlogTag,
    updateBlogTag,
    deleteBlogTag,
};

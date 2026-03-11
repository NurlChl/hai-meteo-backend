import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as blogPostService from './blogPost.service.js';
import pick from '../../shared/utils/pick.js';

const createBlogPost = catchAsync(async (req, res) => {
    const post = await blogPostService.createBlogPost(req.body);
    res.status(httpStatus.CREATED).send(post);
});

const getBlogPosts = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset', 'status', 'search']);
    const result = await blogPostService.getBlogPosts(filter);
    res.send(result);
});

const getBlogPost = catchAsync(async (req, res) => {
    const post = await blogPostService.getBlogPostById(req.params.blogPostId);
    res.send(post);
});

const updateBlogPost = catchAsync(async (req, res) => {
    const post = await blogPostService.updateBlogPostById(req.params.blogPostId, req.body);
    res.send(post);
});

const deleteBlogPost = catchAsync(async (req, res) => {
    await blogPostService.deleteBlogPostById(req.params.blogPostId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createBlogPost,
    getBlogPosts,
    getBlogPost,
    updateBlogPost,
    deleteBlogPost,
};

import httpStatus from 'http-status';
import * as blogPostRepository from './blogPost.repository.js';
import * as blogCategoryRepository from '../blogCategory/blogCategory.repository.js';
import * as blogTagRepository from '../blogTag/blogTag.repository.js';
import * as mediaAssetService from '../mediaAsset/mediaAsset.service.js';
import ApiError from '../../shared/utils/ApiError.js';

const ensureCategoriesExist = async (categoryIds) => {
    if (!categoryIds?.length) {
        return;
    }
    const uniqueIds = [...new Set(categoryIds)];
    const categories = await blogCategoryRepository.getBlogCategoriesByIds(uniqueIds);
    if (categories.length !== uniqueIds.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'One or more blog categories not found');
    }
};

const ensureTagsExist = async (tagIds) => {
    if (!tagIds?.length) {
        return;
    }
    const uniqueIds = [...new Set(tagIds)];
    const tags = await blogTagRepository.getBlogTagsByIds(uniqueIds);
    if (tags.length !== uniqueIds.length) {
        throw new ApiError(httpStatus.NOT_FOUND, 'One or more blog tags not found');
    }
};

const attachRelations = async (post) => {
    if (!post) {
        return post;
    }
    const [categoryIds, tagIds] = await Promise.all([
        blogPostRepository.getBlogPostCategoryIds(post.id),
        blogPostRepository.getBlogPostTagIds(post.id),
    ]);
    return { ...post, categoryIds, tagIds };
};

const ensurePublishedAt = (postData) => {
    if (postData?.status === 'published' && !postData.publishedAt) {
        return { ...postData, publishedAt: new Date() };
    }
    return postData;
};

const createBlogPost = async (postBody) => {
    const { categoryIds, tagIds, ...postData } = postBody;
    const normalizedPostData = ensurePublishedAt(postData);
    if (normalizedPostData.coverMediaId !== undefined && normalizedPostData.coverMediaId !== null) {
        await mediaAssetService.getMediaAssetById(normalizedPostData.coverMediaId);
    }
    await ensureCategoriesExist(categoryIds);
    await ensureTagsExist(tagIds);

    const post = await blogPostRepository.createBlogPost(normalizedPostData);
    if (categoryIds) {
        await blogPostRepository.replaceBlogPostCategories(post.id, [...new Set(categoryIds)]);
    }
    if (tagIds) {
        await blogPostRepository.replaceBlogPostTags(post.id, [...new Set(tagIds)]);
    }
    return attachRelations(post);
};

const getBlogPosts = (filter) => {
    return blogPostRepository.getBlogPosts(filter);
};

const getBlogPostById = async (id) => {
    const post = await blogPostRepository.getBlogPostById(id);
    if (!post) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Blog post not found');
    }
    return attachRelations(post);
};

const updateBlogPostById = async (id, updateBody) => {
    const { categoryIds, tagIds, ...postData } = updateBody;
    await getBlogPostById(id);
    const normalizedPostData = ensurePublishedAt(postData);
    if (normalizedPostData.coverMediaId !== undefined && normalizedPostData.coverMediaId !== null) {
        await mediaAssetService.getMediaAssetById(normalizedPostData.coverMediaId);
    }
    if (categoryIds) {
        await ensureCategoriesExist(categoryIds);
    }
    if (tagIds) {
        await ensureTagsExist(tagIds);
    }

    const post = await blogPostRepository.updateBlogPostById(id, normalizedPostData);
    if (categoryIds) {
        await blogPostRepository.replaceBlogPostCategories(id, [...new Set(categoryIds)]);
    }
    if (tagIds) {
        await blogPostRepository.replaceBlogPostTags(id, [...new Set(tagIds)]);
    }
    return attachRelations(post);
};

const deleteBlogPostById = async (id) => {
    await getBlogPostById(id);
    return blogPostRepository.deleteBlogPostById(id);
};

export {
    createBlogPost,
    getBlogPosts,
    getBlogPostById,
    updateBlogPostById,
    deleteBlogPostById,
};

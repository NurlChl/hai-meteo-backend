import Joi from 'joi';

const blogStatus = Joi.string().valid('draft', 'published', 'archived');

const getBlogPosts = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0),
        status: blogStatus.optional(),
    }),
};

const createBlogPost = {
    body: Joi.object().keys({
        slug: Joi.string().required(),
        title: Joi.string().required(),
        excerpt: Joi.string().optional(),
        contentMd: Joi.string().required(),
        coverMediaId: Joi.number().integer().allow(null).optional(),
        authorName: Joi.string().optional(),
        status: blogStatus.optional(),
        publishedAt: Joi.date().iso().optional(),
        categoryIds: Joi.array().items(Joi.number().integer()).optional(),
        tagIds: Joi.array().items(Joi.number().integer()).optional(),
    }),
};

const getBlogPost = {
    params: Joi.object().keys({
        blogPostId: Joi.number().integer().required(),
    }),
};

const updateBlogPost = {
    params: Joi.object().keys({
        blogPostId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            slug: Joi.string(),
            title: Joi.string(),
            excerpt: Joi.string().optional(),
            contentMd: Joi.string(),
            coverMediaId: Joi.number().integer().allow(null).optional(),
            authorName: Joi.string().optional(),
            status: blogStatus.optional(),
            publishedAt: Joi.date().iso().optional(),
            categoryIds: Joi.array().items(Joi.number().integer()).optional(),
            tagIds: Joi.array().items(Joi.number().integer()).optional(),
        })
        .min(1),
};

const deleteBlogPost = {
    params: Joi.object().keys({
        blogPostId: Joi.number().integer().required(),
    }),
};

export {
    getBlogPosts,
    createBlogPost,
    getBlogPost,
    updateBlogPost,
    deleteBlogPost,
};

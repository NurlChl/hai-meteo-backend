import Joi from 'joi';

const getBlogTags = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0),
        search: Joi.string().allow('', null),
    }),
};

const createBlogTag = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        slug: Joi.string().required(),
    }),
};

const getBlogTag = {
    params: Joi.object().keys({
        blogTagId: Joi.number().integer().required(),
    }),
};

const updateBlogTag = {
    params: Joi.object().keys({
        blogTagId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            slug: Joi.string(),
        })
        .min(1),
};

const deleteBlogTag = {
    params: Joi.object().keys({
        blogTagId: Joi.number().integer().required(),
    }),
};

export {
    getBlogTags,
    createBlogTag,
    getBlogTag,
    updateBlogTag,
    deleteBlogTag,
};

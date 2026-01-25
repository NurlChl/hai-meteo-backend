import Joi from 'joi';

const getPages = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        slug: Joi.string(),
        isPublished: Joi.boolean(),
        search: Joi.string().allow('', null),
        offset: Joi.number().integer(),
    }),
};

const createPage = {
    body: Joi.object().keys({
        slug: Joi.string().required(),
        title: Joi.string().optional(),
        metaTitle: Joi.string().optional(),
        metaDesc: Joi.string().optional(),
        isPublished: Joi.boolean().optional(),
    }),
};

const getPage = {
    params: Joi.object().keys({
        pageId: Joi.number().integer().required(),
    }),
};

const getPageBySlug = {
    params: Joi.object().keys({
        slug: Joi.string().required(),
    }),
};

const updatePage = {
    params: Joi.object().keys({
        pageId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            slug: Joi.string(),
            title: Joi.string().optional(),
            metaTitle: Joi.string().optional(),
            metaDesc: Joi.string().optional(),
            isPublished: Joi.boolean().optional(),
        })
        .min(1),
};

const deletePage = {
    params: Joi.object().keys({
        pageId: Joi.number().integer().required(),
    }),
};

export {
    getPages,
    createPage,
    getPage,
    getPageBySlug,
    updatePage,
    deletePage,
};

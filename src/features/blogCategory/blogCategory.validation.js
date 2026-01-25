import Joi from 'joi';

const getBlogCategories = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0),
        search: Joi.string().optional(),
    }),
};

const createBlogCategory = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        slug: Joi.string().required(),
    }),
};

const getBlogCategory = {
    params: Joi.object().keys({
        blogCategoryId: Joi.number().integer().required(),
    }),
};

const updateBlogCategory = {
    params: Joi.object().keys({
        blogCategoryId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            name: Joi.string(),
            slug: Joi.string(),
        })
        .min(1),
};

const deleteBlogCategory = {
    params: Joi.object().keys({
        blogCategoryId: Joi.number().integer().required(),
    }),
};

export {
    getBlogCategories,
    createBlogCategory,
    getBlogCategory,
    updateBlogCategory,
    deleteBlogCategory,
};

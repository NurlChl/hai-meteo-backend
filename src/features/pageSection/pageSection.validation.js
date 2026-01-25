import Joi from 'joi';

const getPageSections = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0),
        pageId: Joi.number().integer().optional(),
        isEnabled: Joi.boolean().optional(),
    }),
};

const createPageSection = {
    body: Joi.object().keys({
        pageId: Joi.number().integer().required(),
        sectionKey: Joi.string().required(),
        sectionType: Joi.string().required(),
        sortOrder: Joi.number().integer().min(0).optional(),
        title: Joi.string().optional(),
        subtitle: Joi.string().optional(),
        content: Joi.object().unknown(true).optional(),
        backgroundMediaId: Joi.number().integer().allow(null).optional(),
        isEnabled: Joi.boolean().optional(),
    }),
};

const getPageSection = {
    params: Joi.object().keys({
        pageSectionId: Joi.number().integer().required(),
    }),
};

const updatePageSection = {
    params: Joi.object().keys({
        pageSectionId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            pageId: Joi.number().integer(),
            sectionKey: Joi.string(),
            sectionType: Joi.string(),
            sortOrder: Joi.number().integer().min(0),
            title: Joi.string().optional(),
            subtitle: Joi.string().optional(),
            content: Joi.object().unknown(true).optional(),
            backgroundMediaId: Joi.number().integer().allow(null).optional(),
            isEnabled: Joi.boolean().optional(),
        })
        .min(1),
};

const deletePageSection = {
    params: Joi.object().keys({
        pageSectionId: Joi.number().integer().required(),
    }),
};

export {
    getPageSections,
    createPageSection,
    getPageSection,
    updatePageSection,
    deletePageSection,
};

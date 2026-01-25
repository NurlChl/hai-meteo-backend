import Joi from 'joi';

const getNavigationItems = {
    query: Joi.object().keys({
        location: Joi.string().valid('header', 'footer', 'social'),
        isEnabled: Joi.boolean(),
        search: Joi.string().allow('', null),
        limit: Joi.number().integer(),
        offset: Joi.number().integer(),
    }),
};

const createNavigationItem = {
    body: Joi.object().keys({
        location: Joi.string().valid('header', 'footer', 'social').required(),
        label: Joi.string().required(),
        href: Joi.string().required(),
        iconMediaId: Joi.number().integer().allow(null).optional(),
        sortOrder: Joi.number().integer().min(0).optional(),
        isEnabled: Joi.boolean().optional(),
    }),
};

const getNavigationItem = {
    params: Joi.object().keys({
        navigationItemId: Joi.number().integer().required(),
    }),
};

const updateNavigationItem = {
    params: Joi.object().keys({
        navigationItemId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            location: Joi.string().valid('header', 'footer', 'social'),
            label: Joi.string(),
            href: Joi.string(),
            iconMediaId: Joi.number().integer().allow(null).optional(),
            sortOrder: Joi.number().integer().min(0).optional(),
            isEnabled: Joi.boolean().optional(),
        })
        .min(1),
};

const deleteNavigationItem = {
    params: Joi.object().keys({
        navigationItemId: Joi.number().integer().required(),
    }),
};

export {
    getNavigationItems,
    createNavigationItem,
    getNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
};

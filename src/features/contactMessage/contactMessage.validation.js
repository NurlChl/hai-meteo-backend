import Joi from 'joi';

const getContactMessages = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0),
        status: Joi.string().valid('new', 'in_progress', 'done', 'spam').optional(),
    }),
};

const createContactMessage = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        company: Joi.string().optional(),
        subject: Joi.string().optional(),
        message: Joi.string().required(),
    }),
};

const getContactMessage = {
    params: Joi.object().keys({
        contactMessageId: Joi.number().integer().required(),
    }),
};

const updateContactMessage = {
    params: Joi.object().keys({
        contactMessageId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            status: Joi.string().valid('new', 'in_progress', 'done', 'spam').optional(),
        })
        .min(1),
};

const deleteContactMessage = {
    params: Joi.object().keys({
        contactMessageId: Joi.number().integer().required(),
    }),
};

export {
    getContactMessages,
    createContactMessage,
    getContactMessage,
    updateContactMessage,
    deleteContactMessage,
};

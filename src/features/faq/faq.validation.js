import Joi from 'joi';

const getFaqs = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0),
        isPublished: Joi.boolean().optional(),
    }),
};

const createFaq = {
    body: Joi.object().keys({
        question: Joi.string().required(),
        answerMd: Joi.string().required(),
        sortOrder: Joi.number().integer().min(0).optional(),
        isPublished: Joi.boolean().optional(),
    }),
};

const getFaq = {
    params: Joi.object().keys({
        faqId: Joi.number().integer().required(),
    }),
};

const updateFaq = {
    params: Joi.object().keys({
        faqId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            question: Joi.string(),
            answerMd: Joi.string(),
            sortOrder: Joi.number().integer().min(0),
            isPublished: Joi.boolean().optional(),
        })
        .min(1),
};

const deleteFaq = {
    params: Joi.object().keys({
        faqId: Joi.number().integer().required(),
    }),
};

export {
    getFaqs,
    createFaq,
    getFaq,
    updateFaq,
    deleteFaq,
};

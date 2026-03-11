import Joi from 'joi';

const getChatQuestions = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0),
        isEnabled: Joi.boolean().optional(),
    }),
};

const createChatQuestion = {
    body: Joi.object().keys({
        question: Joi.string().required(),
        sortOrder: Joi.number().integer().min(0).optional(),
        isEnabled: Joi.boolean().optional(),
    }),
};

const getChatQuestion = {
    params: Joi.object().keys({
        questionId: Joi.number().integer().required(),
    }),
};

const updateChatQuestion = {
    params: Joi.object().keys({
        questionId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            question: Joi.string(),
            sortOrder: Joi.number().integer().min(0),
            isEnabled: Joi.boolean().optional(),
        })
        .min(1),
};

const deleteChatQuestion = {
    params: Joi.object().keys({
        questionId: Joi.number().integer().required(),
    }),
};

export {
    getChatQuestions,
    createChatQuestion,
    getChatQuestion,
    updateChatQuestion,
    deleteChatQuestion,
};

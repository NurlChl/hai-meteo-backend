import httpStatus from 'http-status';
import * as chatQuestionRepository from './chatQuestion.repository.js';
import ApiError from '../../shared/utils/ApiError.js';

const createChatQuestion = (body) => {
    return chatQuestionRepository.createChatQuestion(body);
};

const getChatQuestions = (filter) => {
    return chatQuestionRepository.getChatQuestions(filter);
};

const getChatQuestionById = async (id) => {
    const question = await chatQuestionRepository.getChatQuestionById(id);
    if (!question) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chat question not found');
    }
    return question;
};

const updateChatQuestionById = async (id, updateBody) => {
    await getChatQuestionById(id);
    return chatQuestionRepository.updateChatQuestionById(id, updateBody);
};

const deleteChatQuestionById = async (id) => {
    await getChatQuestionById(id);
    return chatQuestionRepository.deleteChatQuestionById(id);
};

export {
    createChatQuestion,
    getChatQuestions,
    getChatQuestionById,
    updateChatQuestionById,
    deleteChatQuestionById,
};

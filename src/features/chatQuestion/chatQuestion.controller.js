import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as chatQuestionService from './chatQuestion.service.js';
import pick from '../../shared/utils/pick.js';

const createChatQuestion = catchAsync(async (req, res) => {
    const question = await chatQuestionService.createChatQuestion(req.body);
    res.status(httpStatus.CREATED).send(question);
});

const getChatQuestions = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset', 'isEnabled']);
    const result = await chatQuestionService.getChatQuestions({
        ...filter,
        isEnabled: typeof filter.isEnabled === 'string' ? filter.isEnabled === 'true' : filter.isEnabled,
    });
    res.send(result);
});

const getChatQuestion = catchAsync(async (req, res) => {
    const question = await chatQuestionService.getChatQuestionById(req.params.questionId);
    res.send(question);
});

const updateChatQuestion = catchAsync(async (req, res) => {
    const question = await chatQuestionService.updateChatQuestionById(req.params.questionId, req.body);
    res.send(question);
});

const deleteChatQuestion = catchAsync(async (req, res) => {
    await chatQuestionService.deleteChatQuestionById(req.params.questionId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createChatQuestion,
    getChatQuestions,
    getChatQuestion,
    updateChatQuestion,
    deleteChatQuestion,
};

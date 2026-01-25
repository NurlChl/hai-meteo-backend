import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as contactMessageService from './contactMessage.service.js';
import pick from '../../shared/utils/pick.js';

const createContactMessage = catchAsync(async (req, res) => {
    const message = await contactMessageService.createContactMessage(req.body);
    res.status(httpStatus.CREATED).send(message);
});

const getContactMessages = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset', 'status']);
    const result = await contactMessageService.getContactMessages(filter);
    res.send(result);
});

const getContactMessage = catchAsync(async (req, res) => {
    const message = await contactMessageService.getContactMessageById(req.params.contactMessageId);
    res.send(message);
});

const updateContactMessage = catchAsync(async (req, res) => {
    const message = await contactMessageService.updateContactMessageById(req.params.contactMessageId, req.body);
    res.send(message);
});

const deleteContactMessage = catchAsync(async (req, res) => {
    await contactMessageService.deleteContactMessageById(req.params.contactMessageId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createContactMessage,
    getContactMessages,
    getContactMessage,
    updateContactMessage,
    deleteContactMessage,
};

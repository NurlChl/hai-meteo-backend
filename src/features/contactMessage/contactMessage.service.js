import httpStatus from 'http-status';
import * as contactMessageRepository from './contactMessage.repository.js';
import ApiError from '../../shared/utils/ApiError.js';

const createContactMessage = (messageBody) => {
    return contactMessageRepository.createContactMessage(messageBody);
};

const getContactMessages = (filter) => {
    return contactMessageRepository.getContactMessages(filter);
};

const getContactMessageById = async (id) => {
    const message = await contactMessageRepository.getContactMessageById(id);
    if (!message) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Contact message not found');
    }
    return message;
};

const updateContactMessageById = async (id, updateBody) => {
    await getContactMessageById(id);
    return contactMessageRepository.updateContactMessageById(id, updateBody);
};

const deleteContactMessageById = async (id) => {
    await getContactMessageById(id);
    return contactMessageRepository.deleteContactMessageById(id);
};

export {
    createContactMessage,
    getContactMessages,
    getContactMessageById,
    updateContactMessageById,
    deleteContactMessageById,
};

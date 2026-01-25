import httpStatus from 'http-status';
import * as faqRepository from './faq.repository.js';
import ApiError from '../../shared/utils/ApiError.js';

const createFaq = (faqBody) => {
    return faqRepository.createFaq(faqBody);
};

const getFaqs = (filter) => {
    return faqRepository.getFaqs(filter);
};

const getFaqById = async (id) => {
    const faq = await faqRepository.getFaqById(id);
    if (!faq) {
        throw new ApiError(httpStatus.NOT_FOUND, 'FAQ not found');
    }
    return faq;
};

const updateFaqById = async (id, updateBody) => {
    await getFaqById(id);
    return faqRepository.updateFaqById(id, updateBody);
};

const deleteFaqById = async (id) => {
    await getFaqById(id);
    return faqRepository.deleteFaqById(id);
};

export {
    createFaq,
    getFaqs,
    getFaqById,
    updateFaqById,
    deleteFaqById,
};

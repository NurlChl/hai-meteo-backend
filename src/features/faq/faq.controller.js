import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as faqService from './faq.service.js';
import pick from '../../shared/utils/pick.js';

const createFaq = catchAsync(async (req, res) => {
    const faq = await faqService.createFaq(req.body);
    res.status(httpStatus.CREATED).send(faq);
});

const getFaqs = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset', 'isPublished', 'search']);
    const result = await faqService.getFaqs({
        ...filter,
        isPublished: typeof filter.isPublished === 'string' ? filter.isPublished === 'true' : filter.isPublished,
    });
    res.send(result);
});

const getFaq = catchAsync(async (req, res) => {
    const faq = await faqService.getFaqById(req.params.faqId);
    res.send(faq);
});

const updateFaq = catchAsync(async (req, res) => {
    const faq = await faqService.updateFaqById(req.params.faqId, req.body);
    res.send(faq);
});

const deleteFaq = catchAsync(async (req, res) => {
    await faqService.deleteFaqById(req.params.faqId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createFaq,
    getFaqs,
    getFaq,
    updateFaq,
    deleteFaq,
};

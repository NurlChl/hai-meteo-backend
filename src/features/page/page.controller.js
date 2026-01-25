import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as pageService from './page.service.js';
import pick from '../../shared/utils/pick.js';

const createPage = catchAsync(async (req, res) => {
    const page = await pageService.createPage(req.body);
    res.status(httpStatus.CREATED).send(page);
});

const getPages = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset', 'slug', 'isPublished', 'search']);
    const result = await pageService.getPages(filter);
    res.send(result);
});

const getPage = catchAsync(async (req, res) => {
    const page = await pageService.getPageById(req.params.pageId);
    res.send(page);
});

const getPageBySlug = catchAsync(async (req, res) => {
    const page = await pageService.getPageBySlug(req.params.slug);
    res.send(page);
});

const updatePage = catchAsync(async (req, res) => {
    const page = await pageService.updatePageById(req.params.pageId, req.body);
    res.send(page);
});

const deletePage = catchAsync(async (req, res) => {
    await pageService.deletePageById(req.params.pageId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createPage,
    getPages,
    getPage,
    getPageBySlug,
    updatePage,
    deletePage,
};

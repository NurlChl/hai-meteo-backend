import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as pageSectionService from './pageSection.service.js';
import pick from '../../shared/utils/pick.js';

const createPageSection = catchAsync(async (req, res) => {
    const section = await pageSectionService.createPageSection(req.body);
    res.status(httpStatus.CREATED).send(section);
});

const getPageSections = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset', 'pageId', 'isEnabled']);
    const result = await pageSectionService.getPageSections({
        ...filter,
        pageId: filter.pageId ? Number(filter.pageId) : undefined,
        isEnabled: typeof filter.isEnabled === 'string' ? filter.isEnabled === 'true' : filter.isEnabled,
    });
    res.send(result);
});

const getPageSection = catchAsync(async (req, res) => {
    const section = await pageSectionService.getPageSectionById(req.params.pageSectionId);
    res.send(section);
});

const updatePageSection = catchAsync(async (req, res) => {
    const section = await pageSectionService.updatePageSectionById(req.params.pageSectionId, req.body);
    res.send(section);
});

const deletePageSection = catchAsync(async (req, res) => {
    await pageSectionService.deletePageSectionById(req.params.pageSectionId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createPageSection,
    getPageSections,
    getPageSection,
    updatePageSection,
    deletePageSection,
};

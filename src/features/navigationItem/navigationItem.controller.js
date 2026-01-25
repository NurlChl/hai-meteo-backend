import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as navigationItemService from './navigationItem.service.js';
import pick from '../../shared/utils/pick.js';

const createNavigationItem = catchAsync(async (req, res) => {
    const item = await navigationItemService.createNavigationItem(req.body);
    res.status(httpStatus.CREATED).send(item);
});

const getNavigationItems = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset', 'location', 'isEnabled', 'search']);
    const result = await navigationItemService.getNavigationItems(filter);
    res.send(result);
});

const getNavigationItem = catchAsync(async (req, res) => {
    const item = await navigationItemService.getNavigationItemById(req.params.navigationItemId);
    res.send(item);
});

const updateNavigationItem = catchAsync(async (req, res) => {
    const item = await navigationItemService.updateNavigationItemById(req.params.navigationItemId, req.body);
    res.send(item);
});

const deleteNavigationItem = catchAsync(async (req, res) => {
    await navigationItemService.deleteNavigationItemById(req.params.navigationItemId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createNavigationItem,
    getNavigationItems,
    getNavigationItem,
    updateNavigationItem,
    deleteNavigationItem,
};

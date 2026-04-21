import httpStatus from 'http-status';
import catchAsync from '../../shared/utils/catchAsync.js';
import * as mediaAssetService from './mediaAsset.service.js';
import pick from '../../shared/utils/pick.js';
import ApiError from '../../shared/utils/ApiError.js';
import { buildStorageObjectKey, uploadBufferToGcs } from '../../shared/config/storage.js';

const createMediaAsset = catchAsync(async (req, res) => {
    const mediaAsset = await mediaAssetService.createMediaAsset(req.body);
    res.status(httpStatus.CREATED).send(mediaAsset);
});

const uploadMediaAsset = catchAsync(async (req, res) => {
    const file = req.file;

    if (!file) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
    }

    const { altText, width, height } = req.body;
    const objectKey = buildStorageObjectKey(file);
    const uploadResult = await uploadBufferToGcs({ file, objectKey });

    const mediaAssetBody = {
        fileUrl: uploadResult.fileUrl || objectKey,
        altText: altText || file.originalname,
        mimeType: file.mimetype,
        width: width ? parseInt(width, 10) : null,
        height: height ? parseInt(height, 10) : null,
    };

    const mediaAsset = await mediaAssetService.createMediaAsset(mediaAssetBody);
    res.status(httpStatus.CREATED).send(mediaAsset);
});

const getMediaAssets = catchAsync(async (req, res) => {
    const filter = pick(req.query, ['limit', 'offset']);
    const result = await mediaAssetService.getMediaAssets(filter);
    res.send(result);
});

const getMediaAsset = catchAsync(async (req, res) => {
    const mediaAsset = await mediaAssetService.getMediaAssetById(req.params.mediaAssetId);
    res.send(mediaAsset);
});

const updateMediaAsset = catchAsync(async (req, res) => {
    const mediaAsset = await mediaAssetService.updateMediaAssetById(req.params.mediaAssetId, req.body);
    res.send(mediaAsset);
});

const deleteMediaAsset = catchAsync(async (req, res) => {
    await mediaAssetService.deleteMediaAssetById(req.params.mediaAssetId);
    res.status(httpStatus.NO_CONTENT).send();
});

export {
    createMediaAsset,
    uploadMediaAsset,
    getMediaAssets,
    getMediaAsset,
    updateMediaAsset,
    deleteMediaAsset,
};

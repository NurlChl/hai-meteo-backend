import Joi from 'joi';

const getMediaAssets = {
    query: Joi.object().keys({
        limit: Joi.number().integer().min(1).max(100).default(10),
        offset: Joi.number().integer().min(0).default(0),
    }),
};

const createMediaAsset = {
    body: Joi.object().keys({
        fileUrl: Joi.string().required(),
        altText: Joi.string().optional(),
        mimeType: Joi.string().optional(),
        width: Joi.number().integer().min(1).optional(),
        height: Joi.number().integer().min(1).optional(),
    }),
};

const getMediaAsset = {
    params: Joi.object().keys({
        mediaAssetId: Joi.number().integer().required(),
    }),
};

const updateMediaAsset = {
    params: Joi.object().keys({
        mediaAssetId: Joi.number().integer().required(),
    }),
    body: Joi.object()
        .keys({
            fileUrl: Joi.string(),
            altText: Joi.string().optional(),
            mimeType: Joi.string().optional(),
            width: Joi.number().integer().min(1).optional(),
            height: Joi.number().integer().min(1).optional(),
        })
        .min(1),
};

const deleteMediaAsset = {
    params: Joi.object().keys({
        mediaAssetId: Joi.number().integer().required(),
    }),
};

export {
    getMediaAssets,
    createMediaAsset,
    getMediaAsset,
    updateMediaAsset,
    deleteMediaAsset,
};

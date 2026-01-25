import db from '../../shared/config/database.js';
import { mediaAssets } from '../../db/schema.js';
import { eq, count } from 'drizzle-orm';

const createMediaAsset = async (mediaAssetBody) => {
    const [mediaAsset] = await db.insert(mediaAssets).values(mediaAssetBody).returning();
    return mediaAsset;
};

const getMediaAssets = async (options = {}) => {
    const { limit = 10, offset = 0 } = options;
    const results = await db.select().from(mediaAssets).limit(limit).offset(offset);
    const [{ count: totalCount }] = await db.select({ count: count() }).from(mediaAssets);
    return {
        results,
        totalResults: Number(totalCount),
        limit,
        offset,
    };
};

const getMediaAssetById = async (id) => {
    const [mediaAsset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id));
    return mediaAsset;
};

const updateMediaAssetById = async (id, updateBody) => {
    const [mediaAsset] = await db.update(mediaAssets).set(updateBody).where(eq(mediaAssets.id, id)).returning();
    return mediaAsset;
};

const deleteMediaAssetById = async (id) => {
    const [mediaAsset] = await db.delete(mediaAssets).where(eq(mediaAssets.id, id)).returning();
    return mediaAsset;
};

export {
    createMediaAsset,
    getMediaAssets,
    getMediaAssetById,
    updateMediaAssetById,
    deleteMediaAssetById,
};

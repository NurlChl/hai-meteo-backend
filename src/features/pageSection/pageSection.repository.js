import db from '../../shared/config/database.js';
import { pageSections } from '../../db/schema.js';
import { eq, count, and } from 'drizzle-orm';

const createPageSection = async (sectionBody) => {
    const [section] = await db.insert(pageSections).values(sectionBody).returning();
    return section;
};

const getPageSections = async (options = {}) => {
    const { limit = 10, offset = 0, pageId, isEnabled } = options;
    const whereConditions = [];
    if (pageId) {
        whereConditions.push(eq(pageSections.pageId, pageId));
    }
    if (typeof isEnabled === 'boolean') {
        whereConditions.push(eq(pageSections.isEnabled, isEnabled));
    }
    const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

    let listQuery = db.select().from(pageSections);
    let countQuery = db.select({ count: count() }).from(pageSections);
    if (whereClause) {
        listQuery = listQuery.where(whereClause);
        countQuery = countQuery.where(whereClause);
    }
    const results = await listQuery.limit(limit).offset(offset);
    const [{ count: totalCount }] = await countQuery;

    return {
        results,
        totalResults: Number(totalCount),
        limit,
        offset,
    };
};

const getPageSectionById = async (id) => {
    const [section] = await db.select().from(pageSections).where(eq(pageSections.id, id));
    return section;
};

const updatePageSectionById = async (id, updateBody) => {
    const [section] = await db
        .update(pageSections)
        .set({ ...updateBody, updatedAt: new Date() })
        .where(eq(pageSections.id, id))
        .returning();
    return section;
};

const deletePageSectionById = async (id) => {
    const [section] = await db.delete(pageSections).where(eq(pageSections.id, id)).returning();
    return section;
};

export {
    createPageSection,
    getPageSections,
    getPageSectionById,
    updatePageSectionById,
    deletePageSectionById,
};

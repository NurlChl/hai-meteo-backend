import db from '../../shared/config/database.js';
import { pages } from '../../db/schema.js';
import { eq, count, and, or, ilike } from 'drizzle-orm';

const createPage = async (pageBody) => {
    const [page] = await db.insert(pages).values(pageBody).returning();
    return page;
};

const getPages = async (options = {}) => {
    const { limit = 10, offset = 0, slug, isPublished, search } = options;
    const whereConditions = [];
    if (slug) {
        whereConditions.push(eq(pages.slug, slug));
    }
    if (typeof isPublished === 'boolean') {
        whereConditions.push(eq(pages.isPublished, isPublished));
    }
    if (search) {
        whereConditions.push(or(ilike(pages.title, `%${search}%`), ilike(pages.slug, `%${search}%`)));
    }
    const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

    let listQuery = db.select().from(pages);
    let countQuery = db.select({ count: count() }).from(pages);
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

const getPageById = async (id) => {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page;
};

const getPageBySlug = async (slug) => {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
};

const updatePageById = async (id, updateBody) => {
    const [page] = await db
        .update(pages)
        .set({ ...updateBody, updatedAt: new Date() })
        .where(eq(pages.id, id))
        .returning();
    return page;
};

const deletePageById = async (id) => {
    const [page] = await db.delete(pages).where(eq(pages.id, id)).returning();
    return page;
};

export {
    createPage,
    getPages,
    getPageById,
    getPageBySlug,
    updatePageById,
    deletePageById,
};

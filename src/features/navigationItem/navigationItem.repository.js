import db from '../../shared/config/database.js';
import { navigationItems } from '../../db/schema.js';
import { eq, count, and, or, ilike } from 'drizzle-orm';

const createNavigationItem = async (itemBody) => {
    const [item] = await db.insert(navigationItems).values(itemBody).returning();
    return item;
};

const getNavigationItems = async (options = {}) => {
    const { limit = 10, offset = 0, location, isEnabled, search } = options;
    const whereConditions = [];
    if (location) {
        whereConditions.push(eq(navigationItems.location, location));
    }
    if (typeof isEnabled === 'boolean') {
        whereConditions.push(eq(navigationItems.isEnabled, isEnabled));
    }
    if (search) {
        whereConditions.push(or(ilike(navigationItems.label, `%${search}%`), ilike(navigationItems.href, `%${search}%`)));
    }
    const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

    let listQuery = db.select().from(navigationItems);
    let countQuery = db.select({ count: count() }).from(navigationItems);
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

const getNavigationItemById = async (id) => {
    const [item] = await db.select().from(navigationItems).where(eq(navigationItems.id, id));
    return item;
};

const updateNavigationItemById = async (id, updateBody) => {
    const [item] = await db
        .update(navigationItems)
        .set({ ...updateBody, updatedAt: new Date() })
        .where(eq(navigationItems.id, id))
        .returning();
    return item;
};

const deleteNavigationItemById = async (id) => {
    const [item] = await db.delete(navigationItems).where(eq(navigationItems.id, id)).returning();
    return item;
};

export {
    createNavigationItem,
    getNavigationItems,
    getNavigationItemById,
    updateNavigationItemById,
    deleteNavigationItemById,
};

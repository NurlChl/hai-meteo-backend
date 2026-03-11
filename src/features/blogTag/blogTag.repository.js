import db from '../../shared/config/database.js';
import { blogTags } from '../../db/schema.js';
import { eq, count, inArray, and, or, ilike } from 'drizzle-orm';

const createBlogTag = async (tagBody) => {
    const [tag] = await db.insert(blogTags).values(tagBody).returning();
    return tag;
};

const getBlogTags = async (options = {}) => {
    const limit = Number(options.limit) || 10;
    const offset = Number(options.offset) || 0;
    const { search } = options;

    const whereConditions = [];
    if (search) {
        whereConditions.push(or(ilike(blogTags.name, `%${search}%`), ilike(blogTags.slug, `%${search}%`)));
    }
    const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

    let listQuery = db.select().from(blogTags);
    let countQuery = db.select({ count: count() }).from(blogTags);

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

const getBlogTagById = async (id) => {
    const [tag] = await db.select().from(blogTags).where(eq(blogTags.id, id));
    return tag;
};

const getBlogTagsByIds = async (ids) => {
    if (!ids?.length) {
        return [];
    }
    const tags = await db.select().from(blogTags).where(inArray(blogTags.id, ids));
    return tags;
};

const updateBlogTagById = async (id, updateBody) => {
    const [tag] = await db.update(blogTags).set(updateBody).where(eq(blogTags.id, id)).returning();
    return tag;
};

const deleteBlogTagById = async (id) => {
    const [tag] = await db.delete(blogTags).where(eq(blogTags.id, id)).returning();
    return tag;
};

export {
    createBlogTag,
    getBlogTags,
    getBlogTagById,
    getBlogTagsByIds,
    updateBlogTagById,
    deleteBlogTagById,
};

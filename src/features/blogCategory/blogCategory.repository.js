import db from '../../shared/config/database.js';
import { blogCategories } from '../../db/schema.js';
import { eq, count, inArray, and, or, ilike } from 'drizzle-orm';

const createBlogCategory = async (categoryBody) => {
    const [category] = await db.insert(blogCategories).values(categoryBody).returning();
    return category;
};

const getBlogCategories = async (options = {}) => {
    const { limit = 10, offset = 0, search } = options;

    const whereConditions = [];
    if (search) {
        whereConditions.push(or(ilike(blogCategories.name, `%${search}%`), ilike(blogCategories.slug, `%${search}%`)));
    }
    const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

    let listQuery = db.select().from(blogCategories);
    let countQuery = db.select({ count: count() }).from(blogCategories);

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

const getBlogCategoryById = async (id) => {
    const [category] = await db.select().from(blogCategories).where(eq(blogCategories.id, id));
    return category;
};

const getBlogCategoriesByIds = async (ids) => {
    if (!ids?.length) {
        return [];
    }
    const categories = await db.select().from(blogCategories).where(inArray(blogCategories.id, ids));
    return categories;
};

const updateBlogCategoryById = async (id, updateBody) => {
    const [category] = await db.update(blogCategories).set(updateBody).where(eq(blogCategories.id, id)).returning();
    return category;
};

const deleteBlogCategoryById = async (id) => {
    const [category] = await db.delete(blogCategories).where(eq(blogCategories.id, id)).returning();
    return category;
};

export {
    createBlogCategory,
    getBlogCategories,
    getBlogCategoryById,
    getBlogCategoriesByIds,
    updateBlogCategoryById,
    deleteBlogCategoryById,
};

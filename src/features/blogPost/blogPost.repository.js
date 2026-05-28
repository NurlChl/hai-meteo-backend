import db from '../../shared/config/database.js';
import { blogPosts, blogPostCategories, blogPostTags } from '../../db/schema.js';
import { eq, count, and, or, ilike, desc } from 'drizzle-orm';

const createBlogPost = async (postBody) => {
    const [post] = await db.insert(blogPosts).values(postBody).returning();
    return post;
};

const getBlogPosts = async (options = {}) => {
    const limit = Number(options.limit) || 10;
    const offset = Number(options.offset) || 0;
    const { status, search } = options;
    const whereConditions = [];
    if (status) {
        whereConditions.push(eq(blogPosts.status, status));
    }
    if (search) {
        whereConditions.push(or(ilike(blogPosts.title, `%${search}%`), ilike(blogPosts.slug, `%${search}%`)));
    }
    const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

    let listQuery = db.select().from(blogPosts);
    let countQuery = db.select({ count: count() }).from(blogPosts);
    if (whereClause) {
        listQuery = listQuery.where(whereClause);
        countQuery = countQuery.where(whereClause);
    }
    const results = await listQuery
        .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
        .limit(limit)
        .offset(offset);
    const [{ count: totalCount }] = await countQuery;

    return {
        results,
        totalResults: Number(totalCount),
        limit,
        offset,
    };
};

const getBlogPostById = async (id) => {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
};

const updateBlogPostById = async (id, updateBody) => {
    const [post] = await db
        .update(blogPosts)
        .set({ ...updateBody, updatedAt: new Date() })
        .where(eq(blogPosts.id, id))
        .returning();
    return post;
};

const deleteBlogPostById = async (id) => {
    const [post] = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return post;
};

const replaceBlogPostCategories = async (postId, categoryIds) => {
    await db.delete(blogPostCategories).where(eq(blogPostCategories.postId, postId));
    if (categoryIds?.length) {
        const values = categoryIds.map((categoryId) => ({ postId, categoryId }));
        await db.insert(blogPostCategories).values(values);
    }
};

const replaceBlogPostTags = async (postId, tagIds) => {
    await db.delete(blogPostTags).where(eq(blogPostTags.postId, postId));
    if (tagIds?.length) {
        const values = tagIds.map((tagId) => ({ postId, tagId }));
        await db.insert(blogPostTags).values(values);
    }
};

const getBlogPostCategoryIds = async (postId) => {
    const rows = await db
        .select({ categoryId: blogPostCategories.categoryId })
        .from(blogPostCategories)
        .where(eq(blogPostCategories.postId, postId));
    return rows.map((row) => row.categoryId);
};

const getBlogPostTagIds = async (postId) => {
    const rows = await db
        .select({ tagId: blogPostTags.tagId })
        .from(blogPostTags)
        .where(eq(blogPostTags.postId, postId));
    return rows.map((row) => row.tagId);
};

export {
    createBlogPost,
    getBlogPosts,
    getBlogPostById,
    updateBlogPostById,
    deleteBlogPostById,
    replaceBlogPostCategories,
    replaceBlogPostTags,
    getBlogPostCategoryIds,
    getBlogPostTagIds,
};

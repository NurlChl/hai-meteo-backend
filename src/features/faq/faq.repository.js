import db from '../../shared/config/database.js';
import { faqs } from '../../db/schema.js';
import { eq, count, and } from 'drizzle-orm';

const createFaq = async (faqBody) => {
    const [faq] = await db.insert(faqs).values(faqBody).returning();
    return faq;
};

const getFaqs = async (options = {}) => {
    const { limit = 10, offset = 0, isPublished } = options;
    const whereConditions = [];
    if (typeof isPublished === 'boolean') {
        whereConditions.push(eq(faqs.isPublished, isPublished));
    }
    const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

    let listQuery = db.select().from(faqs);
    let countQuery = db.select({ count: count() }).from(faqs);
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

const getFaqById = async (id) => {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq;
};

const updateFaqById = async (id, updateBody) => {
    const [faq] = await db
        .update(faqs)
        .set({ ...updateBody, updatedAt: new Date() })
        .where(eq(faqs.id, id))
        .returning();
    return faq;
};

const deleteFaqById = async (id) => {
    const [faq] = await db.delete(faqs).where(eq(faqs.id, id)).returning();
    return faq;
};

export {
    createFaq,
    getFaqs,
    getFaqById,
    updateFaqById,
    deleteFaqById,
};

import db from '../../shared/config/database.js';
import { chatQuestions } from '../../db/schema.js';
import { eq, count, and } from 'drizzle-orm';

const createChatQuestion = async (body) => {
    const [question] = await db.insert(chatQuestions).values(body).returning();
    return question;
};

const getChatQuestions = async (options = {}) => {
    const limit = Number(options.limit) || 10;
    const offset = Number(options.offset) || 0;
    const { isEnabled } = options;
    const whereConditions = [];
    if (typeof isEnabled === 'boolean') {
        whereConditions.push(eq(chatQuestions.isEnabled, isEnabled));
    }
    const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

    let listQuery = db.select().from(chatQuestions).orderBy(chatQuestions.sortOrder);
    let countQuery = db.select({ count: count() }).from(chatQuestions);
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

const getChatQuestionById = async (id) => {
    const [question] = await db.select().from(chatQuestions).where(eq(chatQuestions.id, id));
    return question;
};

const updateChatQuestionById = async (id, updateBody) => {
    const [question] = await db
        .update(chatQuestions)
        .set({ ...updateBody, updatedAt: new Date() })
        .where(eq(chatQuestions.id, id))
        .returning();
    return question;
};

const deleteChatQuestionById = async (id) => {
    const [question] = await db.delete(chatQuestions).where(eq(chatQuestions.id, id)).returning();
    return question;
};

export {
    createChatQuestion,
    getChatQuestions,
    getChatQuestionById,
    updateChatQuestionById,
    deleteChatQuestionById,
};

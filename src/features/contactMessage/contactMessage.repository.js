import db from '../../shared/config/database.js';
import { contactMessages } from '../../db/schema.js';
import { eq, count, and } from 'drizzle-orm';

const createContactMessage = async (messageBody) => {
    const [message] = await db.insert(contactMessages).values(messageBody).returning();
    return message;
};

const getContactMessages = async (options = {}) => {
    const { limit = 10, offset = 0, status } = options;
    const whereConditions = [];
    if (status) {
        whereConditions.push(eq(contactMessages.status, status));
    }
    const whereClause = whereConditions.length ? and(...whereConditions) : undefined;

    let listQuery = db.select().from(contactMessages);
    let countQuery = db.select({ count: count() }).from(contactMessages);
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

const getContactMessageById = async (id) => {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
};

const updateContactMessageById = async (id, updateBody) => {
    const [message] = await db
        .update(contactMessages)
        .set(updateBody)
        .where(eq(contactMessages.id, id))
        .returning();
    return message;
};

const deleteContactMessageById = async (id) => {
    const [message] = await db.delete(contactMessages).where(eq(contactMessages.id, id)).returning();
    return message;
};

export {
    createContactMessage,
    getContactMessages,
    getContactMessageById,
    updateContactMessageById,
    deleteContactMessageById,
};

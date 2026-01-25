import db from '../../shared/config/database.js';
import { adminUsers } from '../../db/schema.js';
import { eq } from 'drizzle-orm';

const createUser = async (userBody) => {
    const [user] = await db.insert(adminUsers).values(userBody).returning();
    return user;
};

const getUserByEmail = async (email) => {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user;
};

const getUserById = async (id) => {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
};

const updateLastLoginAt = async (id) => {
    const [user] = await db
        .update(adminUsers)
        .set({ lastLoginAt: new Date(), updatedAt: new Date() })
        .where(eq(adminUsers.id, id))
        .returning();
    return user;
};

export {
    createUser,
    getUserByEmail,
    getUserById,
    updateLastLoginAt,
};

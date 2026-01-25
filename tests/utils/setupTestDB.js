import db from '../../src/shared/config/database.js';
import {
    adminUsers,
    mediaAssets,
    pages,
    pageSections,
    faqs,
    blogCategories,
    blogPosts,
    blogPostCategories,
    blogTags,
    blogPostTags,
    navigationItems,
    contactMessages,
} from '../../src/db/schema.js';
import { sql } from 'drizzle-orm';

const setupTestDB = () => {
    beforeAll(async () => {
        // any global setup
    });

    beforeEach(async () => {
        // Clean DB before each test
        await db.execute(sql`
            TRUNCATE TABLE
                ${adminUsers},
                ${mediaAssets},
                ${pages},
                ${pageSections},
                ${faqs},
                ${blogCategories},
                ${blogPosts},
                ${blogPostCategories},
                ${blogTags},
                ${blogPostTags},
                ${navigationItems},
                ${contactMessages}
            RESTART IDENTITY CASCADE
        `);
    });

    afterAll(async () => {
        // Close db connection if needed, though with pool it might be fine, but forceExit handles it
    });
};

export default setupTestDB;

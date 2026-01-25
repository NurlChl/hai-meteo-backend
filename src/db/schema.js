import {
    pgTable,
    text,
    integer,
    timestamp,
    boolean,
    jsonb,
    pgEnum,
    bigserial,
    bigint,
    primaryKey,
} from 'drizzle-orm/pg-core';

const blogPostStatus = pgEnum('blog_post_status', ['draft', 'published', 'archived']);

const adminUsers = pgTable('admin_users', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    isActive: boolean('is_active').notNull().default(true),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const mediaAssets = pgTable('media_assets', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    fileUrl: text('file_url').notNull(),
    altText: text('alt_text'),
    mimeType: text('mime_type'),
    width: integer('width'),
    height: integer('height'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

const pages = pgTable('pages', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title'),
    metaTitle: text('meta_title'),
    metaDesc: text('meta_desc'),
    isPublished: boolean('is_published').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const pageSections = pgTable('page_sections', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    pageId: bigint('page_id', { mode: 'number' })
        .notNull()
        .references(() => pages.id, { onDelete: 'cascade' }),
    sectionKey: text('section_key').notNull(),
    sectionType: text('section_type').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    title: text('title'),
    subtitle: text('subtitle'),
    content: jsonb('content').notNull().default({}),
    backgroundMediaId: bigint('background_media_id', { mode: 'number' }).references(() => mediaAssets.id),
    isEnabled: boolean('is_enabled').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const faqs = pgTable('faqs', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    question: text('question').notNull(),
    answerMd: text('answer_md').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const blogCategories = pgTable('blog_categories', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
});

const blogPosts = pgTable('blog_posts', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    excerpt: text('excerpt'),
    contentMd: text('content_md').notNull(),
    coverMediaId: bigint('cover_media_id', { mode: 'number' }).references(() => mediaAssets.id),
    authorName: text('author_name'),
    status: blogPostStatus('status').notNull().default('draft'),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const blogPostCategories = pgTable(
    'blog_post_categories',
    {
        postId: bigint('post_id', { mode: 'number' })
            .notNull()
            .references(() => blogPosts.id, { onDelete: 'cascade' }),
        categoryId: bigint('category_id', { mode: 'number' })
            .notNull()
            .references(() => blogCategories.id, { onDelete: 'cascade' }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.postId, table.categoryId] }),
    }),
);

const blogTags = pgTable('blog_tags', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull().unique(),
    slug: text('slug').notNull().unique(),
});

const blogPostTags = pgTable(
    'blog_post_tags',
    {
        postId: bigint('post_id', { mode: 'number' })
            .notNull()
            .references(() => blogPosts.id, { onDelete: 'cascade' }),
        tagId: bigint('tag_id', { mode: 'number' })
            .notNull()
            .references(() => blogTags.id, { onDelete: 'cascade' }),
    },
    (table) => ({
        pk: primaryKey({ columns: [table.postId, table.tagId] }),
    }),
);

const navigationItems = pgTable('navigation_items', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    location: text('location').notNull(),
    label: text('label').notNull(),
    href: text('href').notNull(),
    iconMediaId: bigint('icon_media_id', { mode: 'number' }).references(() => mediaAssets.id),
    sortOrder: integer('sort_order').notNull().default(0),
    isEnabled: boolean('is_enabled').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

const contactMessages = pgTable('contact_messages', {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    company: text('company'),
    subject: text('subject'),
    message: text('message').notNull(),
    status: text('status').notNull().default('new'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export {
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
    blogPostStatus,
};

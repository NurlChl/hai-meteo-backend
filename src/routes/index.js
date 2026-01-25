import express from 'express';
import authRoute from '../features/auth/auth.routes.js';
import mediaAssetRoute from '../features/mediaAsset/mediaAsset.routes.js';
import pageRoute from '../features/page/page.routes.js';
import pageSectionRoute from '../features/pageSection/pageSection.routes.js';
import faqRoute from '../features/faq/faq.routes.js';
import blogCategoryRoute from '../features/blogCategory/blogCategory.routes.js';
import blogTagRoute from '../features/blogTag/blogTag.routes.js';
import blogPostRoute from '../features/blogPost/blogPost.routes.js';
import navigationItemRoute from '../features/navigationItem/navigationItem.routes.js';
import contactMessageRoute from '../features/contactMessage/contactMessage.routes.js';

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/media-assets',
        route: mediaAssetRoute,
    },
    {
        path: '/pages',
        route: pageRoute,
    },
    {
        path: '/page-sections',
        route: pageSectionRoute,
    },
    {
        path: '/faqs',
        route: faqRoute,
    },
    {
        path: '/blog-categories',
        route: blogCategoryRoute,
    },
    {
        path: '/blog-tags',
        route: blogTagRoute,
    },
    {
        path: '/blog-posts',
        route: blogPostRoute,
    },
    {
        path: '/navigation-items',
        route: navigationItemRoute,
    },
    {
        path: '/contact-messages',
        route: contactMessageRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;

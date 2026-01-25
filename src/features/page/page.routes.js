import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as pageValidation from './page.validation.js';
import * as pageController from './page.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Pages
 *   description: Page management endpoints
 */

/**
 * @swagger
 * /v1/pages:
 *   post:
 *     summary: Create a new page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slug
 *             properties:
 *               slug:
 *                 type: string
 *                 example: home
 *               title:
 *                 type: string
 *               metaTitle:
 *                 type: string
 *               metaDesc:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Page created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all pages
 *     tags: [Pages]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of pages to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of pages to skip
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *         description: Filter by page slug
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by publish status
 *     responses:
 *       200:
 *         description: List of pages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Page'
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 offset:
 *                   type: integer
 *                   example: 0
 */
router
    .route('/')
    .post(auth(), validate(pageValidation.createPage), pageController.createPage)
    .get(validate(pageValidation.getPages), pageController.getPages);

/**
 * @swagger
 * /v1/pages/slug/{slug}:
 *   get:
 *     summary: Get a page by slug
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Page slug
 *     responses:
 *       200:
 *         description: Page found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       404:
 *         description: Page not found
 */
router.get('/slug/:slug', validate(pageValidation.getPageBySlug), pageController.getPageBySlug);

/**
 * @swagger
 * /v1/pages/{pageId}:
 *   get:
 *     summary: Get a page by ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page ID
 *     responses:
 *       200:
 *         description: Page found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       404:
 *         description: Page not found
 *   patch:
 *     summary: Update a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slug:
 *                 type: string
 *               title:
 *                 type: string
 *               metaTitle:
 *                 type: string
 *               metaDesc:
 *                 type: string
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Page updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Page'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page not found
 *   delete:
 *     summary: Delete a page
 *     tags: [Pages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page ID
 *     responses:
 *       204:
 *         description: Page deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page not found
 */
router
    .route('/:pageId')
    .get(validate(pageValidation.getPage), pageController.getPage)
    .patch(auth(), validate(pageValidation.updatePage), pageController.updatePage)
    .delete(auth(), validate(pageValidation.deletePage), pageController.deletePage);

export default router;

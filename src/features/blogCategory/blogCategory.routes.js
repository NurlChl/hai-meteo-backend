import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as blogCategoryValidation from './blogCategory.validation.js';
import * as blogCategoryController from './blogCategory.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BlogCategories
 *   description: Blog category management endpoints
 */

/**
 * @swagger
 * /v1/blog-categories:
 *   post:
 *     summary: Create a new blog category
 *     tags: [BlogCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: Insight
 *               slug:
 *                 type: string
 *                 example: insight
 *     responses:
 *       201:
 *         description: Blog category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategory'
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all blog categories
 *     tags: [BlogCategories]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of categories to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of categories to skip
 *     responses:
 *       200:
 *         description: List of blog categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogCategory'
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
    .post(auth(), validate(blogCategoryValidation.createBlogCategory), blogCategoryController.createBlogCategory)
    .get(validate(blogCategoryValidation.getBlogCategories), blogCategoryController.getBlogCategories);

/**
 * @swagger
 * /v1/blog-categories/{blogCategoryId}:
 *   get:
 *     summary: Get a blog category by ID
 *     tags: [BlogCategories]
 *     parameters:
 *       - in: path
 *         name: blogCategoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog category ID
 *     responses:
 *       200:
 *         description: Blog category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategory'
 *       404:
 *         description: Blog category not found
 *   patch:
 *     summary: Update a blog category
 *     tags: [BlogCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogCategoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               slug:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog category updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogCategory'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog category not found
 *   delete:
 *     summary: Delete a blog category
 *     tags: [BlogCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogCategoryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog category ID
 *     responses:
 *       204:
 *         description: Blog category deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog category not found
 */
router
    .route('/:blogCategoryId')
    .get(validate(blogCategoryValidation.getBlogCategory), blogCategoryController.getBlogCategory)
    .patch(auth(), validate(blogCategoryValidation.updateBlogCategory), blogCategoryController.updateBlogCategory)
    .delete(auth(), validate(blogCategoryValidation.deleteBlogCategory), blogCategoryController.deleteBlogCategory);

export default router;

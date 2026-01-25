import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as blogTagValidation from './blogTag.validation.js';
import * as blogTagController from './blogTag.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BlogTags
 *   description: Blog tag management endpoints
 */

/**
 * @swagger
 * /v1/blog-tags:
 *   post:
 *     summary: Create a new blog tag
 *     tags: [BlogTags]
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
 *                 example: Forecast
 *               slug:
 *                 type: string
 *                 example: forecast
 *     responses:
 *       201:
 *         description: Blog tag created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogTag'
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all blog tags
 *     tags: [BlogTags]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of tags to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of tags to skip
 *     responses:
 *       200:
 *         description: List of blog tags
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogTag'
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
    .post(auth(), validate(blogTagValidation.createBlogTag), blogTagController.createBlogTag)
    .get(validate(blogTagValidation.getBlogTags), blogTagController.getBlogTags);

/**
 * @swagger
 * /v1/blog-tags/{blogTagId}:
 *   get:
 *     summary: Get a blog tag by ID
 *     tags: [BlogTags]
 *     parameters:
 *       - in: path
 *         name: blogTagId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog tag ID
 *     responses:
 *       200:
 *         description: Blog tag found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogTag'
 *       404:
 *         description: Blog tag not found
 *   patch:
 *     summary: Update a blog tag
 *     tags: [BlogTags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogTagId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog tag ID
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
 *         description: Blog tag updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogTag'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog tag not found
 *   delete:
 *     summary: Delete a blog tag
 *     tags: [BlogTags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogTagId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog tag ID
 *     responses:
 *       204:
 *         description: Blog tag deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog tag not found
 */
router
    .route('/:blogTagId')
    .get(validate(blogTagValidation.getBlogTag), blogTagController.getBlogTag)
    .patch(auth(), validate(blogTagValidation.updateBlogTag), blogTagController.updateBlogTag)
    .delete(auth(), validate(blogTagValidation.deleteBlogTag), blogTagController.deleteBlogTag);

export default router;

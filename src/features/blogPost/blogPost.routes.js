import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as blogPostValidation from './blogPost.validation.js';
import * as blogPostController from './blogPost.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: BlogPosts
 *   description: Blog post management endpoints
 */

/**
 * @swagger
 * /v1/blog-posts:
 *   post:
 *     summary: Create a new blog post
 *     tags: [BlogPosts]
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
 *               - title
 *               - contentMd
 *             properties:
 *               slug:
 *                 type: string
 *                 example: weekly-weather
 *               title:
 *                 type: string
 *                 example: Weekly Weather
 *               excerpt:
 *                 type: string
 *               contentMd:
 *                 type: string
 *               coverMediaId:
 *                 type: integer
 *                 nullable: true
 *               authorName:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: draft
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Blog post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category, tag, or media asset not found
 *   get:
 *     summary: Get all blog posts
 *     tags: [BlogPosts]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of posts to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of posts to skip
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of blog posts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogPost'
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
    .post(auth(), validate(blogPostValidation.createBlogPost), blogPostController.createBlogPost)
    .get(validate(blogPostValidation.getBlogPosts), blogPostController.getBlogPosts);

/**
 * @swagger
 * /v1/blog-posts/{blogPostId}:
 *   get:
 *     summary: Get a blog post by ID
 *     tags: [BlogPosts]
 *     parameters:
 *       - in: path
 *         name: blogPostId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog post ID
 *     responses:
 *       200:
 *         description: Blog post found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       404:
 *         description: Blog post not found
 *   patch:
 *     summary: Update a blog post
 *     tags: [BlogPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogPostId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog post ID
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
 *               excerpt:
 *                 type: string
 *               contentMd:
 *                 type: string
 *               coverMediaId:
 *                 type: integer
 *                 nullable: true
 *               authorName:
 *                 type: string
 *               status:
 *                 type: string
 *               publishedAt:
 *                 type: string
 *                 format: date-time
 *               categoryIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Blog post updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BlogPost'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 *   delete:
 *     summary: Delete a blog post
 *     tags: [BlogPosts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogPostId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Blog post ID
 *     responses:
 *       204:
 *         description: Blog post deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Blog post not found
 */
router
    .route('/:blogPostId')
    .get(validate(blogPostValidation.getBlogPost), blogPostController.getBlogPost)
    .patch(auth(), validate(blogPostValidation.updateBlogPost), blogPostController.updateBlogPost)
    .delete(auth(), validate(blogPostValidation.deleteBlogPost), blogPostController.deleteBlogPost);

export default router;

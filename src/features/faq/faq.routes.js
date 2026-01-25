import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as faqValidation from './faq.validation.js';
import * as faqController from './faq.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: FAQs
 *   description: FAQ management endpoints
 */

/**
 * @swagger
 * /v1/faqs:
 *   post:
 *     summary: Create a new FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answerMd
 *             properties:
 *               question:
 *                 type: string
 *                 example: What is Hai Meteo?
 *               answerMd:
 *                 type: string
 *                 example: Hai Meteo is a weather platform.
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: FAQ created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQ'
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQs]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of FAQs to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of FAQs to skip
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *         description: Filter by publish status
 *     responses:
 *       200:
 *         description: List of FAQs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/FAQ'
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
    .post(auth(), validate(faqValidation.createFaq), faqController.createFaq)
    .get(validate(faqValidation.getFaqs), faqController.getFaqs);

/**
 * @swagger
 * /v1/faqs/{faqId}:
 *   get:
 *     summary: Get an FAQ by ID
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: faqId
 *         required: true
 *         schema:
 *           type: integer
 *         description: FAQ ID
 *     responses:
 *       200:
 *         description: FAQ found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQ'
 *       404:
 *         description: FAQ not found
 *   patch:
 *     summary: Update an FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: faqId
 *         required: true
 *         schema:
 *           type: integer
 *         description: FAQ ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               answerMd:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *               isPublished:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: FAQ updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FAQ'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: FAQ not found
 *   delete:
 *     summary: Delete an FAQ
 *     tags: [FAQs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: faqId
 *         required: true
 *         schema:
 *           type: integer
 *         description: FAQ ID
 *     responses:
 *       204:
 *         description: FAQ deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: FAQ not found
 */
router
    .route('/:faqId')
    .get(validate(faqValidation.getFaq), faqController.getFaq)
    .patch(auth(), validate(faqValidation.updateFaq), faqController.updateFaq)
    .delete(auth(), validate(faqValidation.deleteFaq), faqController.deleteFaq);

export default router;

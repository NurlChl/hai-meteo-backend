import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as pageSectionValidation from './pageSection.validation.js';
import * as pageSectionController from './pageSection.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: PageSections
 *   description: Page section management endpoints
 */

/**
 * @swagger
 * /v1/page-sections:
 *   post:
 *     summary: Create a new page section
 *     tags: [PageSections]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pageId
 *               - sectionKey
 *             properties:
 *               pageId:
 *                 type: integer
 *                 example: 1
 *               sectionKey:
 *                 type: string
 *                 example: hero
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *               content:
 *                 type: object
 *                 additionalProperties: true
 *               isEnabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Page section created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PageSection'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page not found
 *   get:
 *     summary: Get all page sections
 *     tags: [PageSections]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of sections to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of sections to skip
 *       - in: query
 *         name: pageId
 *         schema:
 *           type: integer
 *         description: Filter by page ID
 *       - in: query
 *         name: isEnabled
 *         schema:
 *           type: boolean
 *         description: Filter by enabled status
 *     responses:
 *       200:
 *         description: List of page sections
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PageSection'
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
    .post(auth(), validate(pageSectionValidation.createPageSection), pageSectionController.createPageSection)
    .get(validate(pageSectionValidation.getPageSections), pageSectionController.getPageSections);

/**
 * @swagger
 * /v1/page-sections/{pageSectionId}:
 *   get:
 *     summary: Get a page section by ID
 *     tags: [PageSections]
 *     parameters:
 *       - in: path
 *         name: pageSectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page section ID
 *     responses:
 *       200:
 *         description: Page section found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PageSection'
 *       404:
 *         description: Page section not found
 *   patch:
 *     summary: Update a page section
 *     tags: [PageSections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageSectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page section ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pageId:
 *                 type: integer
 *               sectionKey:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *               content:
 *                 type: object
 *                 additionalProperties: true
 *               isEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Page section updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PageSection'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page section not found
 *   delete:
 *     summary: Delete a page section
 *     tags: [PageSections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pageSectionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Page section ID
 *     responses:
 *       204:
 *         description: Page section deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Page section not found
 */
router
    .route('/:pageSectionId')
    .get(validate(pageSectionValidation.getPageSection), pageSectionController.getPageSection)
    .patch(auth(), validate(pageSectionValidation.updatePageSection), pageSectionController.updatePageSection)
    .delete(auth(), validate(pageSectionValidation.deletePageSection), pageSectionController.deletePageSection);

export default router;

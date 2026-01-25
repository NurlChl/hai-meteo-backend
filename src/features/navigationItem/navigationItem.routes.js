import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as navigationItemValidation from './navigationItem.validation.js';
import * as navigationItemController from './navigationItem.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: NavigationItems
 *   description: Navigation item management endpoints
 */

/**
 * @swagger
 * /v1/navigation-items:
 *   post:
 *     summary: Create a new navigation item
 *     tags: [NavigationItems]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - location
 *               - label
 *               - href
 *             properties:
 *               location:
 *                 type: string
 *                 example: header
 *               label:
 *                 type: string
 *                 example: Features
 *               href:
 *                 type: string
 *                 example: /features
 *               iconMediaId:
 *                 type: integer
 *                 nullable: true
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *               isEnabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Navigation item created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NavigationItem'
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all navigation items
 *     tags: [NavigationItems]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of items to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of items to skip
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location
 *       - in: query
 *         name: isEnabled
 *         schema:
 *           type: boolean
 *         description: Filter by enabled status
 *     responses:
 *       200:
 *         description: List of navigation items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/NavigationItem'
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
    .post(auth(), validate(navigationItemValidation.createNavigationItem), navigationItemController.createNavigationItem)
    .get(validate(navigationItemValidation.getNavigationItems), navigationItemController.getNavigationItems);

/**
 * @swagger
 * /v1/navigation-items/{navigationItemId}:
 *   get:
 *     summary: Get a navigation item by ID
 *     tags: [NavigationItems]
 *     parameters:
 *       - in: path
 *         name: navigationItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Navigation item ID
 *     responses:
 *       200:
 *         description: Navigation item found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NavigationItem'
 *       404:
 *         description: Navigation item not found
 *   patch:
 *     summary: Update a navigation item
 *     tags: [NavigationItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: navigationItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Navigation item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: string
 *               label:
 *                 type: string
 *               href:
 *                 type: string
 *               iconMediaId:
 *                 type: integer
 *                 nullable: true
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *               isEnabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Navigation item updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NavigationItem'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Navigation item not found
 *   delete:
 *     summary: Delete a navigation item
 *     tags: [NavigationItems]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: navigationItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Navigation item ID
 *     responses:
 *       204:
 *         description: Navigation item deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Navigation item not found
 */
router
    .route('/:navigationItemId')
    .get(validate(navigationItemValidation.getNavigationItem), navigationItemController.getNavigationItem)
    .patch(auth(), validate(navigationItemValidation.updateNavigationItem), navigationItemController.updateNavigationItem)
    .delete(auth(), validate(navigationItemValidation.deleteNavigationItem), navigationItemController.deleteNavigationItem);

export default router;

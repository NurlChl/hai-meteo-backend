import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as contactMessageValidation from './contactMessage.validation.js';
import * as contactMessageController from './contactMessage.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ContactMessages
 *   description: Contact message endpoints
 */

/**
 * @swagger
 * /v1/contact-messages:
 *   post:
 *     summary: Create a new contact message
 *     tags: [ContactMessages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: Alex
 *               email:
 *                 type: string
 *                 format: email
 *                 example: alex@example.com
 *               company:
 *                 type: string
 *                 example: Meteo Inc.
 *               subject:
 *                 type: string
 *                 example: Partnership
 *               message:
 *                 type: string
 *                 example: Interested in collaboration.
 *     responses:
 *       201:
 *         description: Contact message created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *   get:
 *     summary: Get all contact messages
 *     tags: [ContactMessages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of messages to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of messages to skip
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of contact messages
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ContactMessage'
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 offset:
 *                   type: integer
 *                   example: 0
 *       401:
 *         description: Unauthorized
 */
router
    .route('/')
    .post(validate(contactMessageValidation.createContactMessage), contactMessageController.createContactMessage)
    .get(auth(), validate(contactMessageValidation.getContactMessages), contactMessageController.getContactMessages);

/**
 * @swagger
 * /v1/contact-messages/{contactMessageId}:
 *   get:
 *     summary: Get a contact message by ID
 *     tags: [ContactMessages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactMessageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact message ID
 *     responses:
 *       200:
 *         description: Contact message found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact message not found
 *   patch:
 *     summary: Update a contact message
 *     tags: [ContactMessages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactMessageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contact message updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ContactMessage'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact message not found
 *   delete:
 *     summary: Delete a contact message
 *     tags: [ContactMessages]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactMessageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Contact message ID
 *     responses:
 *       204:
 *         description: Contact message deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact message not found
 */
router
    .route('/:contactMessageId')
    .get(auth(), validate(contactMessageValidation.getContactMessage), contactMessageController.getContactMessage)
    .patch(auth(), validate(contactMessageValidation.updateContactMessage), contactMessageController.updateContactMessage)
    .delete(auth(), validate(contactMessageValidation.deleteContactMessage), contactMessageController.deleteContactMessage);

export default router;

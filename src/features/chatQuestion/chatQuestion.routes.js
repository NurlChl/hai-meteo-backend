import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as chatQuestionValidation from './chatQuestion.validation.js';
import * as chatQuestionController from './chatQuestion.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ChatQuestions
 *   description: Chat quick-action questions management
 */

/**
 * @swagger
 * /v1/chat-questions:
 *   post:
 *     summary: Create a new chat question
 *     tags: [ChatQuestions]
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
 *             properties:
 *               question:
 *                 type: string
 *               sortOrder:
 *                 type: integer
 *                 minimum: 0
 *               isEnabled:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Chat question created successfully
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all chat questions
 *     tags: [ChatQuestions]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *       - in: query
 *         name: isEnabled
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of chat questions
 */
router
    .route('/')
    .post(auth(), validate(chatQuestionValidation.createChatQuestion), chatQuestionController.createChatQuestion)
    .get(validate(chatQuestionValidation.getChatQuestions), chatQuestionController.getChatQuestions);

/**
 * @swagger
 * /v1/chat-questions/{questionId}:
 *   get:
 *     summary: Get a chat question by ID
 *     tags: [ChatQuestions]
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Chat question found
 *       404:
 *         description: Not found
 *   patch:
 *     summary: Update a chat question
 *     tags: [ChatQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 *   delete:
 *     summary: Delete a chat question
 *     tags: [ChatQuestions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: questionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not found
 */
router
    .route('/:questionId')
    .get(validate(chatQuestionValidation.getChatQuestion), chatQuestionController.getChatQuestion)
    .patch(auth(), validate(chatQuestionValidation.updateChatQuestion), chatQuestionController.updateChatQuestion)
    .delete(auth(), validate(chatQuestionValidation.deleteChatQuestion), chatQuestionController.deleteChatQuestion);

export default router;

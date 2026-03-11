import express from 'express';
import validate from '../../shared/middlewares/validate.js';
import * as mediaAssetValidation from './mediaAsset.validation.js';
import * as mediaAssetController from './mediaAsset.controller.js';
import auth from '../../shared/middlewares/authMiddleware.js';
import { upload } from '../../shared/config/upload.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MediaAssets
 *   description: Media asset management endpoints
 */

/**
 * @swagger
 * /v1/media-assets:
 *   post:
 *     summary: Create a new media asset
 *     tags: [MediaAssets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fileUrl
 *             properties:
 *               fileUrl:
 *                 type: string
 *                 example: https://cdn.example.com/banner.png
 *               altText:
 *                 type: string
 *                 example: Banner image
 *               mimeType:
 *                 type: string
 *                 example: image/png
 *               width:
 *                 type: integer
 *                 minimum: 1
 *               height:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       201:
 *         description: Media asset created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaAsset'
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: Get all media assets
 *     tags: [MediaAssets]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Maximum number of media assets to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of media assets to skip
 *     responses:
 *       200:
 *         description: List of media assets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MediaAsset'
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
    .post(auth(), validate(mediaAssetValidation.createMediaAsset), mediaAssetController.createMediaAsset)
    .get(validate(mediaAssetValidation.getMediaAssets), mediaAssetController.getMediaAssets);

router.post('/upload', auth(), upload.single('file'), mediaAssetController.uploadMediaAsset);

/**
 * @swagger
 * /v1/media-assets/{mediaAssetId}:
 *   get:
 *     summary: Get a media asset by ID
 *     tags: [MediaAssets]
 *     parameters:
 *       - in: path
 *         name: mediaAssetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Media asset ID
 *     responses:
 *       200:
 *         description: Media asset found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaAsset'
 *       404:
 *         description: Media asset not found
 *   patch:
 *     summary: Update a media asset
 *     tags: [MediaAssets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mediaAssetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Media asset ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileUrl:
 *                 type: string
 *               altText:
 *                 type: string
 *               mimeType:
 *                 type: string
 *               width:
 *                 type: integer
 *                 minimum: 1
 *               height:
 *                 type: integer
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Media asset updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MediaAsset'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Media asset not found
 *   delete:
 *     summary: Delete a media asset
 *     tags: [MediaAssets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mediaAssetId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Media asset ID
 *     responses:
 *       204:
 *         description: Media asset deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Media asset not found
 */
router
    .route('/:mediaAssetId')
    .get(validate(mediaAssetValidation.getMediaAsset), mediaAssetController.getMediaAsset)
    .patch(auth(), validate(mediaAssetValidation.updateMediaAsset), mediaAssetController.updateMediaAsset)
    .delete(auth(), validate(mediaAssetValidation.deleteMediaAsset), mediaAssetController.deleteMediaAsset);

export default router;

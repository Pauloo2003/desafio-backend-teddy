import { Router } from 'express';
import { getUrls, getUrlById, createUrl, updateUrl, deleteUrl } from '../controllers/Url';
import {authenticateToken} from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/url:
 *   get:
 *     summary: Get all url
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of url
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       403:
 *         description: Forbidden, token is invalid or expired
 */
router.get('/', authenticateToken, getUrls);

/**
 * @openapi
 * /api/url/{id}:
 *   get:
 *     summary: Get a url by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Url details
 *       404:
 *         description: Url not found
 */
router.get('/:id', authenticateToken, getUrlById);

/**
 * @openapi
 * /api/url:
 *   post:
 *     summary: Create a new url
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               urlOriginal:
 *                 type: string
 *     responses:
 *       201:
 *         description: Url created successfully
 */
router.post('/', authenticateToken , createUrl);

/**
 * @openapi
 * /api/url/{id}:
 *   put:
 *     summary: Update a url by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Url updated successfully
 *       404:
 *         description: Url not found
 */
router.put('/:id', authenticateToken, updateUrl);

/**
 * @openapi
 * /api/url/{id}:
 *   delete:
 *     summary: Delete a url by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Url deleted successfully
 *       404:
 *         description: Url not found
 */
router.put('/deleted/:id', authenticateToken, deleteUrl);

export default router;

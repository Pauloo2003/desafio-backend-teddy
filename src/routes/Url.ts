import { Router } from 'express';
import { getUrls, getUrlById, createUrl, updateUrl, deleteUrl } from '../controllers/Url';
import { authenticateToken, authenticateTokenGerarUrl } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/url:
 *   get:
 *     summary: Get all URLs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of URLs
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
 *     summary: Get a URL by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: URL details
 *       404:
 *         description: URL not found
 */
router.get('/:id', authenticateToken, getUrlById);

/**
 * @openapi
 * /api/url:
 *   post:
 *     summary: Create a new URL
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
 *         description: URL created successfully
 *       400:
 *         description: Invalid URL format
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       403:
 *         description: Forbidden, token is invalid or expired
 */
router.post('/', authenticateTokenGerarUrl, createUrl);

/**
 * @openapi
 * /api/url/{id}:
 *   put:
 *     summary: Update a URL by ID
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
 *               originalUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: URL updated successfully
 *       400:
 *         description: Invalid URL format
 *       404:
 *         description: URL not found
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       403:
 *         description: Forbidden, token is invalid or expired
 */
router.put('/:id', authenticateToken, updateUrl);

/**
 * @openapi
 * /api/url/{id}:
 *   delete:
 *     summary: Delete a URL by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *       404:
 *         description: URL not found
 *       401:
 *         description: Unauthorized, token is missing or invalid
 *       403:
 *         description: Forbidden, token is invalid or expired
 */
router.delete('/:id', authenticateToken, deleteUrl);

export default router;

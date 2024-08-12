import { Router } from 'express';
import { shortUrlRedirect } from '../controllers/Url';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /{shortUrl}:
 *   get:
 *     summary: Recebe uma URL encurtada e redireciona para a URL original
 *     tags:
 *     - URL Encurtada
 *     parameters:
 *       - in: path
 *         name: shortUrl
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to the original URL
 *       400:
 *         description: Invalid short URL
 *       404:
 *         description: Short URL not found
 */
router.get('/:shortUrl', shortUrlRedirect);

export default router;

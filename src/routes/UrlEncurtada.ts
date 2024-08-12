import { Router } from 'express';
import { shortUrlRedirect } from '../controllers/Url';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /{shortUrl}:
 *   get:
 *     summary: Redirect a short URL to its original URL
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

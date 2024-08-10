import { Router } from 'express';
import { shortUrlRedirect } from '../controllers/Url';
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
router.get('/:shortUrl', shortUrlRedirect);



export default router;

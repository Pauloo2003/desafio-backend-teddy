import { Router } from 'express';
import { loginUserController, refreshTokenController } from '../controllers/Auth';

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginUserController);

/**
 * @openapi
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh an access token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Refresh token successful
 *       401:
 *         description: Refresh token is required
 *       403:
 *         description: Invalid refresh token
 */
router.post('/refresh-token', refreshTokenController);

export default router;

import { Router, Request, Response, NextFunction } from 'express';
import { loginUserController, refreshTokenController } from '../controllers/Auth';
import logger from '../utils/logger';  // Importando o logger

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags:
 *       - Autenticação
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
 *         description: Logado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token de acesso (JWT)
 *                 refreshToken:
 *                   type: string
 *                   description: Token de atualização
 *       401:
 *         description: Credenciais inválidas
 */

router.post('/login', loginUserController);

/**
 * @openapi
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh token
 *     tags:
 *     - Autenticação
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

import { Router } from 'express';
import { getUrls, getUrlById, createUrl, updateUrl, deleteUrl } from '../controllers/Url';
import { authenticateToken, authenticateTokenGerarUrl } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/url:
 *   get:
 *     summary: Obter todas as URLs do usuário logado
 *     tags:
 *      - URL
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de URLs
 *       401:
 *         description: Não autorizado, token está faltando ou inválido
 *       403:
 *         description: Proibido, token está inválido ou expirado
 */
router.get('/', authenticateToken, getUrls);

/**
 * @openapi
 * /api/url/{id}:
 *   get:
 *     summary: Obter uma URL pelo ID
 *     tags:
 *     - URL
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da URL
 *       404:
 *         description: URL não encontrada
 */
router.get('/:id', authenticateToken, getUrlById);

/**
 * @openapi
 * /api/url:
 *   post:
 *     summary: Criar uma nova URL
 *     tags:
 *     - URL
 *     security:
 *       - bearerAuth: []
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
 *         description: URL criada com sucesso
 *       400:
 *         description: Formato de URL inválido
 *       401:
 *         description: Não autorizado, token está faltando ou inválido
 *       403:
 *         description: Proibido, token está inválido ou expirado
 */
router.post('/', authenticateTokenGerarUrl , createUrl);  // ELA PODE SER ACESSADA POR QUALQQUER UM, POREM TABEM PODE SER ACESSADA POR UM USUARIO AUTENTICADO

/**
 * @openapi
 * /api/url/{id}:
 *   put:
 *     summary: Atualizar uma URL pelo ID
 *     tags:
 *     - URL
 *     security:
 *       - bearerAuth: []
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
 *         description: URL atualizada com sucesso
 *       400:
 *         description: Formato de URL inválido
 *       404:
 *         description: URL não encontrada
 *       401:
 *         description: Não autorizado, token está faltando ou inválido
 *       403:
 *         description: Proibido, token está inválido ou expirado
 */
router.put('/:id', authenticateToken, updateUrl);

/**
 * @openapi
 * /api/url/{id}:
 *   delete:
 *     summary: Deletar uma URL pelo ID
 *     tags:
 *     - URL
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: URL deletada com sucesso
 *       404:
 *         description: URL não encontrada
 *       401:
 *         description: Não autorizado, token está faltando ou inválido
 *       403:
 *         description: Proibido, token está inválido ou expirado
 */
router.delete('/:id', authenticateToken, deleteUrl);

export default router;

import { Router } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../controllers/User';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Obter todos os usuários
 *     tags:
 *     - Usuário
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários
 *       401:
 *         description: Não autorizado, token ausente ou inválido
 *       403:
 *         description: Proibido, token inválido ou expirado
 */
router.get('/', authenticateToken, getUsers);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Obter um usuário pelo ID
 *     tags:
 *     - Usuário
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
 *         description: Detalhes do usuário
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:id', authenticateToken, getUserById);

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Criar um novo usuário
 *     tags:
 *     - Usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *               phone:
 *                type: string
 *
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados de entrada inválidos
 */
router.post('/', createUser);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Atualizar um usuário pelo ID
 *     tags:
 *     - Usuário
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
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso
 *       400:
 *         description: Dados de entrada inválidos
 *       404:
 *         description: Usuário não encontrado
 */
router.put('/:id', authenticateToken, updateUser);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Deletar um usuário pelo ID
 *     tags:
 *     - Usuário
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
 *         description: Usuário deletado com sucesso
 *       404:
 *         description: Usuário não encontrado
 */
router.delete('/:id', authenticateToken, deleteUser);

export default router;

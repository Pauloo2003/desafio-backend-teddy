import { Request, Response } from 'express';
import { User } from '../services/User';
import logger from '../utils/logger'; // Ajuste o caminho conforme necessário

// Define a custom interface for the request user
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number | null;
    };
}

// Define specific request bodies
interface CreateUserRequestBody {
    name: string;
    email: string;
    password: string;
    phone: string;
}

interface UpdateUserRequestBody {
    name?: string;
    email?: string;
    phone?: string;
    updatedAt: string;
}

const userService = new User();

const getUserId = (req: AuthenticatedRequest): number | null => {
    return req.user?.userId || null;
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        logger.info('Usuários recuperados com sucesso.');
        res.json(users);
    } catch (error: any) {
        logger.error(`Erro ao buscar usuários: ${error.message}`);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        logger.warn(`ID de usuário inválido: ${id}`);
        return res.status(400).json({ message: 'ID de usuário inválido' });
    }

    try {
        const user = await userService.getUserById(Number(id));
        logger.info(`Usuário com ID ${id} recuperado com sucesso.`);
        res.json(user);
    } catch (error: any) {
        logger.error(`Erro ao buscar usuário por ID ${id}: ${error.message}`);
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, phone }: CreateUserRequestBody = req.body;
    try {
        const newUser = await userService.createUser({ name, email, password, phone });
        logger.info(`Novo usuário criado com ID ${newUser.id}`);
        res.status(201).json(newUser);
    } catch (error: any) {
        logger.error(`Erro ao criar usuário: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone }: UpdateUserRequestBody = req.body;
    if (isNaN(Number(id))) {
        logger.warn(`ID de usuário inválido: ${id}`);
        return res.status(400).json({ message: 'ID de usuário inválido' });
    }

    try {
        const userEditado = await userService.updateUser(Number(id), { name, email, phone, updatedAt: new Date().toISOString() });
        console.log(userEditado)
        logger.info(`Usuário com ID ${id} atualizado com sucesso.`);
        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error: any) {
        logger.error(`Erro ao atualizar usuário com ID ${id}: ${error.message}`);
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    if (isNaN(Number(id)) || !userId) {
        logger.warn(`ID de usuário inválido ou usuário não autenticado: ${id}`);
        return res.status(400).json({ message: 'ID de usuário inválido ou usuário não autenticado' });
    }

    try {
        await userService.deleteUser(Number(id), Number(userId));
        logger.info(`Usuário com ID ${id} deletado com sucesso.`);
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error: any) {
        logger.error(`Erro ao deletar usuário com ID ${id}: ${error.message}`);
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
};

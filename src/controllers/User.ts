import { Request, Response } from 'express';
import { User } from '../services/User';

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
        res.json(users);
    } catch (error: any) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID de usuário inválido' });
    }

    try {
        const user = await userService.getUserById(Number(id));
        res.json(user);
    } catch (error: any) {
        console.error('Erro ao buscar usuário por ID:', error);
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email, password, phone }: CreateUserRequestBody = req.body;
    try {
        const newUser = await userService.createUser({ name, email, password, phone });
        res.status(201).json(newUser);
    } catch (error: any) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email, phone }: UpdateUserRequestBody = req.body;
    if (isNaN(Number(id))) {
        return res.status(400).json({ message: 'ID de usuário inválido' });
    }

    try {
        await userService.updateUser(Number(id), { name, email, phone, updatedAt: new Date().toISOString() });
        res.json({ message: 'Usuário atualizado com sucesso' });
    } catch (error: any) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);

    if (isNaN(Number(id)) || !userId) {
        return res.status(400).json({ message: 'ID de usuário inválido ou usuário não autenticado' });
    }

    try {
        await userService.deleteUser(Number(id), Number(userId));
        res.json({ message: 'Usuário deletado com sucesso' });
    } catch (error: any) {
        console.error('Erro ao deletar usuário:', error);
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
};

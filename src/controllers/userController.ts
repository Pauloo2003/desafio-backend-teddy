import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number | null;
    };
}

const getUserId = (req: AuthenticatedRequest): number | null => {
    return req.user?.userId || null;
};
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        res.json(users);
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await userService.getUserById(Number(id));
        res.json(user);
    } catch (error : any) {
        res.status(404).json({ message: error.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, email , password , phone } = req.body;
    try {
        const newUser = await userService.createUser({ name, email, password , phone });
        res.status(201).json(newUser);
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email ,phone } = req.body;
    try {
        await userService.updateUser(Number(id), { name, email , phone , updatedAt: '' });
        res.json({ message: 'User updated successfully' });
    } catch (error : any) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);
    try {
        await userService.deleteUser(Number(id), Number(userId));
        res.json({ message: 'Usuario deletado com sucesso' });
    } catch (error : any) {
        res.status(404).json({ message: error.message });
    }
};

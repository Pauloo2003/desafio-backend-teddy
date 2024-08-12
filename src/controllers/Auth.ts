import { Request, Response } from 'express';
import { loginUser, refreshTokenService } from '../services/Auth';

// Login
export const loginUserController = async (req: Request, res: Response) => {
    console.log('loginUserController')
    const { email, password } = req.body;

    try {
        const tokens = await loginUser(email, password);
        res.json(tokens);
    } catch (error : any) {
        res.status(401).json({ message: error.message });
    }
};

// Refresh token
export const refreshTokenController = (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token is required' });
    }

    try {
        const tokens = refreshTokenService(refreshToken);
        res.json(tokens);
    } catch (error : any) {
        res.status(403).json({ message: error.message });
    }
};

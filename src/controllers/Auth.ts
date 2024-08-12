import { Request, Response } from 'express';
import { loginUser, refreshTokenService } from '../services/Auth';
import logger from '../utils/logger';  // Importando o logger

export const loginUserController = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    logger.info(`Tentativa de login: ${email}`);

    try {
        const tokens = await loginUser(email, password);
        logger.info(`Login bem-sucedido: ${email}`);
        res.json(tokens);
    } catch (error: any) {
        logger.error(`Falha no login para ${email}: ${error.message}`);
        res.status(401).json({ message: error.message });
    }
};

export const refreshTokenController = (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        logger.warn('Refresh token não fornecido');  // Logando falta de refresh token
        return res.status(401).json({ message: 'Refresh token é obrigatório' });
    }

    try {
        const tokens = refreshTokenService(refreshToken);
        logger.info('Atualização do refresh token bem-sucedida');  // Logando sucesso na atualização do token
        res.json(tokens);
    } catch (error: any) {
        logger.error(`Falha na atualização do refresh token: ${error.message}`);  // Logando erro na atualização do token
        res.status(403).json({ message: error.message });
    }
};

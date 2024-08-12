import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';
import logger from '../utils/logger';

interface DecodedToken {
    userId: string;
    exp: number;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number | null;
            };
        }
    }
}

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        logger.warn('Refresh token ausente');
        return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
        jwt.verify(refreshToken, jwtConfig.refreshTokenSecret);
        logger.info('Refresh token verificado com sucesso');
        next();
    } catch (error) {
        logger.error('Falha na verificação do refresh token: ' + (error as Error).message);
        res.status(403).json({ msg: "Token inválido!" });
    }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn('Token de autenticação ausente');
        return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            logger.warn('Token inválido: partes incompletas');
            return res.status(403).json({ msg: "Token inválido!" });
        }

        jwt.verify(token, jwtConfig.secret, { algorithms: ['HS256'] });

        const decoded = jwt.decode(token) as DecodedToken;
        if (decoded.exp < Date.now() / 1000) {
            logger.warn('Token expirado');
            return res.status(403).json({ msg: "Token expirado!" });
        }

        req.user = {
            // @ts-ignore
            userId: decoded.userId,
        };

        logger.info('Token autenticado com sucesso');
        next();
    } catch (error) {
        logger.error('Falha na autenticação do token: ' + (error as Error).message);
        res.status(403).json({ msg: "Token inválido!" });
    }
};

export const authenticateTokenGerarUrl = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token !== null && token !== undefined) {
        try {
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                logger.warn('Token inválido: partes incompletas');
                return res.status(403).json({ msg: "Token inválido!" });
            }

            jwt.verify(token, jwtConfig.secret, { algorithms: ['HS256'] });

            const decoded = jwt.decode(token) as DecodedToken;
            if (decoded.exp < Date.now() / 1000) {
                logger.warn('Token expirado');
                return res.status(403).json({ msg: "Token expirado!" });
            }

            req.user = {
                // @ts-ignore
                userId: decoded.userId,
            };

            logger.info('Token autenticado com sucesso');
            next();
        } catch (error) {
            logger.error('Falha na autenticação do token: ' + (error as Error).message);
            res.status(403).json({ msg: "Token inválido!" });
        }
    } else {
        logger.info('Token não fornecido, prosseguindo sem autenticação');
        next();
    }
};

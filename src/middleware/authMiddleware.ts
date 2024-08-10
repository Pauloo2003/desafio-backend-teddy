import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';

interface DecodedToken {
    userId: string;
    exp: number;
}

export const verifyRefreshToken = (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
        jwt.verify(refreshToken, jwtConfig.refreshTokenSecret);
        next();
    } catch (error) {
        res.status(403).json({ msg: "Token inválido!" });
    }
};

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ msg: "Acesso negado" });
    }

    try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            return res.status(403).json({ msg: "Token inválido!" });
        }

        jwt.verify(token, jwtConfig.secret, { algorithms: ['HS256'] });

        const decoded = jwt.decode(token) as DecodedToken;
        if (decoded.exp < Date.now() / 1000) {
            return res.status(403).json({ msg: "Token expirado!" });
        }

        req.user  = {
            userId: decoded.userId,
        };

        next();
    } catch (error) {
        res.status(403).json({ msg: "Token inválido!" });
    }
};


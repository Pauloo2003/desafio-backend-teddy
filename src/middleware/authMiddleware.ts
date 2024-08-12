import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';
import {Logger} from "sequelize/types/utils/logger";

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
            // @ts-ignore
            userId: decoded.userId,
        };

        next();
    } catch (error) {
        res.status(403).json({ msg: "Token inválido!" });
    }
};
export const authenticateTokenGerarUrl = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('VALIDAÇÃO IF',!token || token !== 'null' || token !== undefined)
    if(!token && token !== null && token !== undefined){
        console.log('TOKEN',token)
        try {
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                return res.status(403).json({msg: "Token inválido!"});
            }

            jwt.verify(token, jwtConfig.secret, {algorithms: ['HS256']});

            const decoded = jwt.decode(token) as DecodedToken;
            if (decoded.exp < Date.now() / 1000) {
                return res.status(403).json({msg: "Token expirado!"});
            }


            req.user = {
                // @ts-ignore
                userId: decoded.userId,
            };

            next();
        } catch (error) {
            res.status(403).json({msg: "Token inválido!"});
        }
    }else {
        next();
    }
};


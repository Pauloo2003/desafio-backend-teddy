import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const logRequest = (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Requisição recebida: ${req.method} ${req.originalUrl} - ${JSON.stringify(req.body)}`);

    res.on('finish', () => {
        logger.info(`Resposta enviada: ${res.statusCode} ${req.method} ${req.originalUrl}`);
    });

    next();
};

export default logRequest;

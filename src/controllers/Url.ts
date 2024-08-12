import { Request, Response } from 'express';
import { UrlService } from '../services/Url';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
    user?: {
        userId: number | null;
    };
}

interface CreateUrlRequestBody {
    urlOriginal: string;
}

interface UpdateUrlRequestBody {
    originalUrl?: string;
}

const urlService = new UrlService();

const getUserId = (req: AuthenticatedRequest): number | null => {
    return req.user?.userId || null;
};

export const getUrls = async (req: AuthenticatedRequest, res: Response) => {
    const userId = getUserId(req);
    try {
        const urls = await urlService.getUrls(userId);
        logger.info(`URLs recuperadas para o usuário ID ${userId}`);
        res.json(urls);
    } catch (error: any) {
        logger.error(`Erro ao buscar URLs para o usuário ID ${userId}: ${error.message}`);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: error.message });
    }
};

export const getUrlById = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const urlId = Number(id);
    if (isNaN(urlId)) {
        logger.warn(`ID de URL inválido fornecido: ${id}`);
        return res.status(400).json({ mensagem: 'ID de URL inválido' });
    }
    try {
        const url = await urlService.getUrlById(urlId);
        if (!url) {
            logger.warn(`URL com ID ${urlId} não encontrada`);
            return res.status(404).json({ mensagem: 'URL não encontrada' });
        }
        logger.info(`URL com ID ${urlId} recuperada com sucesso`);
        res.json(url);
    } catch (error: any) {
        logger.error(`Erro ao buscar URL por ID ${urlId}: ${error.message}`);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: error.message });
    }
};

export const shortUrlRedirect = async (req: Request, res: Response) => {
    const { shortUrl } = req.params;
    try {
        const url = await urlService.shortUrlRedirect(shortUrl);
        if (!url) {
            logger.warn(`URL curta não encontrada: ${shortUrl}`);
            return res.status(404).json({ mensagem: 'URL curta não encontrada' });
        }
        logger.info(`Redirecionando para URL original ${url} a partir da URL curta ${shortUrl}`);
        res.redirect(url);
    } catch (error: any) {
        logger.error(`Erro ao redirecionar URL curta ${shortUrl}: ${error.message}`);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: error.message });
    }
};

export const createUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { urlOriginal }: CreateUrlRequestBody = req.body;
    const userId = getUserId(req);

    if (!urlOriginal || typeof urlOriginal !== 'string') {
        logger.warn(`Formato de URL inválido fornecido: ${urlOriginal}`);
        return res.status(400).json({ mensagem: 'Formato de URL inválido' });
    }

    try {
        const newUrl = await urlService.createUrl({ urlOriginal, userId });
        logger.info(`Nova URL criada com sucesso: ${newUrl}`);
        res.status(201).json({ mensagem: 'URL criada com sucesso', url: newUrl });
    } catch (error: any) {
        logger.error(`Erro ao criar URL: ${error.message}`);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: error.message });
    }
};

export const updateUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { originalUrl }: UpdateUrlRequestBody = req.body;
    const userId = getUserId(req);
    const urlId = Number(id);

    if (isNaN(urlId)) {
        logger.warn(`ID de URL inválido fornecido: ${id}`);
        return res.status(400).json({ mensagem: 'ID de URL inválido' });
    }

    try {
        const urlEditada = await urlService.updateUrl(urlId, userId, { originalUrl, updatedAt: '' });
        console.log(urlEditada)
        logger.info(`URL com ID ${urlId} atualizada com sucesso`);
        res.status(200).json({ mensagem: `URL com ID ${urlId} atualizada com sucesso` });
    } catch (error: any) {
        logger.error(`Erro ao atualizar URL com ID ${urlId}: ${error.message}`);
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: error.message });
    }
};


export const deleteUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);
    const urlId = Number(id);

    if (isNaN(urlId)) {
        logger.warn(`ID de URL inválido fornecido: ${id}`);
        return res.status(400).json({ mensagem: 'ID de URL inválido' });
    }

    try {
        await urlService.deleteUrl(urlId, userId);
        logger.info(`URL com ID ${urlId} deletada com sucesso`);
        res.json({ mensagem: 'URL deletada com sucesso' });
    } catch (error: any) {
        logger.error(`Erro ao deletar URL com ID ${urlId}: ${error.message}`);
        res.status(404).json({ mensagem: 'URL não encontrada', detalhes: error.message });
    }
};

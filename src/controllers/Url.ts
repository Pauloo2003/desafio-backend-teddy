import { Request, Response } from 'express';
import { UrlService } from '../services/Url';

// Define uma interface personalizada para o usuário na requisição
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number | null;
    };
}

// Define os corpos das requisições para criação e atualização
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
        res.json(urls);
    } catch (error: any) {
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: error.message });
    }
};

export const getUrlById = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const urlId = Number(id);
    if (isNaN(urlId)) {
        return res.status(400).json({ mensagem: 'ID de URL inválido' });
    }
    try {
        const url = await urlService.getUrlById(urlId);
        if (!url) {
            return res.status(404).json({ mensagem: 'URL não encontrada' });
        }
        res.json(url);
    } catch (error: any) {
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: error.message });
    }
};

export const shortUrlRedirect = async (req: Request, res: Response) => {
    const { shortUrl } = req.params;
    try {
        const url = await urlService.shortUrlRedirect(shortUrl);
        if (!url) {
            return res.status(404).json({ mensagem: 'URL curta não encontrada' });
        }
        res.redirect(url);
    } catch (error: any) {
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: error.message });
    }
};

export const createUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { urlOriginal }: CreateUrlRequestBody = req.body;
    const userId = getUserId(req);

    if (!urlOriginal || typeof urlOriginal !== 'string') {
        return res.status(400).json({ mensagem: 'Formato de URL inválido' });
    }

    try {
        const newUrl = await urlService.createUrl({ urlOriginal, userId });
        res.status(201).json({ mensagem: 'URL criada com sucesso', url: newUrl });
    } catch (error: any) {
        res.status(500).json({ mensagem: 'Erro interno do servidor', detalhes: error.message });
    }
};

export const updateUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { originalUrl }: UpdateUrlRequestBody = req.body;
    const userId = getUserId(req);
    const urlId = Number(id);

    if (isNaN(urlId)) {
        return res.status(400).json({ mensagem: 'ID de URL inválido' });
    }

    try {
        await urlService.updateUrl(urlId, userId, { originalUrl, updatedAt: '' });
        res.json({ mensagem: 'URL atualizada com sucesso' });
    } catch (error: any) {
        res.status(404).json({ mensagem: 'URL não encontrada', detalhes: error.message });
    }
};

export const deleteUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);
    const urlId = Number(id);

    if (isNaN(urlId)) {
        return res.status(400).json({ mensagem: 'ID de URL inválido' });
    }

    try {
        await urlService.deleteUrl(urlId, userId);
        res.json({ mensagem: 'URL deletada com sucesso' });
    } catch (error: any) {
        res.status(404).json({ mensagem: 'URL não encontrada', detalhes: error.message });
    }
};

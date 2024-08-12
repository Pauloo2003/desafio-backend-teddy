import { Request, Response } from 'express';
import { UrlService } from '../services/Url';

// Define a custom interface for the request user
interface AuthenticatedRequest extends Request {
    user?: {
        userId: number | null;
    };
}

// Define specific request bodies
interface CreateUrlRequestBody {
    urlOriginal: string;
}

interface UpdateUrlRequestBody {
    name?: string;
    email?: string;
    phone?: string;
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
        res.status(500).json({ message: error.message });
    }
};

export const getUrlById = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    try {
        const url = await urlService.getUrlById(Number(id));
        res.json(url);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const shortUrlRedirect = async (req: Request, res: Response) => {
    const { shortUrl } = req.params;
    try {
        const url = await urlService.shortUrlRedirect(shortUrl);
        res.redirect(url);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const createUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { urlOriginal }: CreateUrlRequestBody = req.body;
    const userId = getUserId(req);
    try {
        // @ts-ignore
        const newUrl = await urlService.createUrl({ urlOriginal, userId });
        res.status(201).json(newUrl);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const { name, email, phone }: UpdateUrlRequestBody = req.body;
    try {
        await urlService.updateUrl(Number(id), { name, email, phone , updatedAt: '' });
        res.json({ message: 'Url updated successfully' });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteUrl = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const userId = getUserId(req);
    try {
        await urlService.deleteUrl(Number(id), userId);
        res.json({ message: 'Url deleted successfully' });
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

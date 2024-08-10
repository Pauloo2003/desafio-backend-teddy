import { Request, Response } from 'express';
import { UrlService } from '../services/Url';

const urlService = new UrlService();

export const getUrls = async (req: Request, res: Response) => {
    try {
        const urls = await urlService.getUrls();
        res.json(urls);
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUrlById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const url = await urlService.getUrlById(Number(id));
        res.json(url);
    } catch (error : any) {
        res.status(404).json({ message: error.message });
    }
};
export const shortUrlRedirect = async (req: Request, res: Response) => {
    const { shortUrl } = req.params;
    try {
        const url = await urlService.shortUrlRedirect(shortUrl);
        res.redirect(url);
    } catch (error : any) {
        res.status(404).json({ message: error.message });
    }
};

export const createUrl = async (req: Request, res: Response) => {
    const { urlOriginal } = req.body;
    const { userId } = req.user;
    try {
        const newUrl = await urlService.createUrl({ urlOriginal , userId });
        res.status(201).json(newUrl);
    } catch (error : any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUrl = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email ,phone } = req.body;
    try {
        await urlService.updateUrl(Number(id), { name, email , phone });
        res.json({ message: 'Url updated successfully' });
    } catch (error : any) {
        res.status(404).json({ message: error.message });
    }
};

export const deleteUrl = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId } = req.user;
    try {
        await urlService.deleteUrl(Number(id), Number(userId));
        res.json({ message: 'Usuario deletado com sucesso' });
    } catch (error : any) {
        res.status(404).json({ message: error.message });
    }
};

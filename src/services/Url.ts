import validator from 'validator';
import { UrlRepository } from '../repositories/Url';
import moment from 'moment-timezone';
import { Op } from "sequelize";

moment.tz.setDefault('America/Sao_Paulo');

const domain = process.env.NODE_ENV === 'production' ? process.env.URL_PRODUCTION : `${process.env.URL_DEV}:${process.env.PORT}`;

const urlRepository = new UrlRepository();

export class UrlService {
    async getUrls(userId: number | null) {
        try {
            return await urlRepository.findAll(userId);
        } catch (error) {
            console.error('Erro ao obter URLs:', error);
            throw new Error('Erro ao obter URLs');
        }
    }

    async getUrlById(id: number) {
        if (isNaN(id)) {
            throw new Error('ID inválido');
        }
        try {
            const url = await urlRepository.findById(id);
            if (!url) throw new Error('URL não encontrada');
            return url;
        } catch (error) {
            console.error('Erro ao obter URL por ID:', error);
            throw new Error('Erro ao obter URL por ID');
        }
    }

    async shortUrlRedirect(shortUrl: string) {
        if (!validator.isAlphanumeric(shortUrl) || shortUrl.length < 6) {
            throw new Error('URL curta inválida');
        }
        try {
            const urlRecord : any = await urlRepository.findOne({ where: { shortUrl } });

            if (!urlRecord) {
                throw new Error('URL não encontrada');
            }

            const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
            await urlRepository.updateClicks(urlRecord[0].id, { clicks: urlRecord[0].clicks + 1, updatedAt });

            return urlRecord[0].originalUrl;
        } catch (error) {
            console.error('Erro ao redirecionar:', error);
            throw new Error('Erro ao redirecionar');
        }
    }

    async createUrl(data: { urlOriginal: string; userId: number | null }) {
        const { urlOriginal, userId } = data;
        if (!urlOriginal || !validator.isURL(urlOriginal)) {
            throw new Error('URL inválida');
        }

        const shortUrl = await this.generateShortUrl();
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedAt = createdAt;

        const payload = {
            originalUrl: urlOriginal,
            shortUrl,
            clicks: 0,
            createdAt,
            updatedAt,
            userId: userId || null,
        };

        try {
            await urlRepository.create(payload);
            return `${domain}/${shortUrl}`;
        } catch (error) {
            console.error('Erro ao criar URL:', error);
            throw new Error('Erro ao criar URL');
        }
    }

    async generateShortUrl() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let shortUrl = '';
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            shortUrl += characters[randomIndex];
        }
        return shortUrl;
    }

    async updateUrl(id: number, userId: number | null, data: { originalUrl?: string; updatedAt: string; }) {
        if (isNaN(id)) {
            throw new Error('ID inválido');
        }
        if (data.originalUrl && !validator.isURL(data.originalUrl)) {
            throw new Error('URL inválida');
        }

        data.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        try {
            const [updated] = await urlRepository.update(id, userId, data);
            if (!updated) throw new Error('URL não encontrada');
            return updated;
        } catch (error) {
            console.error('Erro ao atualizar URL:', error);
            throw new Error('Erro ao atualizar URL');
        }
    }

    async deleteUrl(id: number, userId: number | null) {
        if (isNaN(id)) {
            throw new Error('ID inválido');
        }
        const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        try {
            const deleted = await urlRepository.delete(id, deletedAt, userId);
            if (!deleted) throw new Error('URL não encontrada');
            return deleted;
        } catch (error) {
            console.error('Erro ao excluir URL:', error);
            throw new Error('Erro ao excluir URL');
        }
    }
}

import validator from 'validator';
import { UrlRepository } from '../repositories/Url';
import moment from 'moment-timezone';
import { Op } from 'sequelize';
import logger from '../utils/logger';

moment.tz.setDefault('America/Sao_Paulo');

const domain = process.env.NODE_ENV === 'production' ? process.env.URL_PRODUCTION : `${process.env.URL_DEV}:${process.env.PORT}`;

const urlRepository = new UrlRepository();

export class UrlService {
    async getUrls(userId: number | null) {
        try {
            const urls = await urlRepository.findAll(userId);
            logger.info(`URLs obtidas para o usuário ID ${userId}`);
            return urls;
        } catch (error : any) {
            logger.error(`Erro ao obter URLs: ${error.message}`);
            throw new Error('Erro ao obter URLs');
        }
    }

    async getUrlById(id: number) {
        if (isNaN(id)) {
            logger.warn(`ID inválido fornecido: ${id}`);
            throw new Error('ID inválido');
        }
        try {
            const url = await urlRepository.findById(id);
            if (!url) {
                logger.warn(`URL com ID ${id} não encontrada`);
                throw new Error('URL não encontrada');
            }
            logger.info(`URL com ID ${id} obtida com sucesso`);
            return url;
        } catch (error : any) {
            logger.error(`Erro ao obter URL por ID ${id}: ${error.message}`);
            throw new Error('Erro ao obter URL por ID');
        }
    }

    async shortUrlRedirect(shortUrl: string) {
        if (!validator.isAlphanumeric(shortUrl) || shortUrl.length < 6) {
            logger.warn(`URL curta inválida fornecida: ${shortUrl}`);
            throw new Error('URL curta inválida');
        }
        try {
            const urlRecord: any = await urlRepository.findOne({ where: { shortUrl } });

            if (!urlRecord) {
                logger.warn(`URL curta não encontrada: ${shortUrl}`);
                throw new Error('URL não encontrada');
            }

            const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
            await urlRepository.updateClicks(urlRecord.id, { clicks: urlRecord.clicks + 1, updatedAt });

            return urlRecord.originalUrl;
        } catch (error : any) {
            logger.error(`Erro ao redirecionar URL curta ${shortUrl}: ${error.message}`);
            throw new Error('Erro ao redirecionar');
        }
    }

    async createUrl(data: { urlOriginal: string; userId: number | null }) {
        const { urlOriginal, userId } = data;
        if (!urlOriginal || !validator.isURL(urlOriginal)) {
            logger.warn(`URL inválida fornecida: ${urlOriginal}`);
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
            logger.info(`URL criada com sucesso: ${payload.originalUrl} (${shortUrl})`);
            return `${domain}/${shortUrl}`;
        } catch (error : any) {
            logger.error(`Erro ao criar URL: ${error.message}`);
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
            logger.warn(`ID inválido fornecido: ${id}`);
            throw new Error('ID inválido');
        }
        if (data.originalUrl && !validator.isURL(data.originalUrl)) {
            logger.warn(`URL inválida fornecida: ${data.originalUrl}`);
            throw new Error('URL inválida');
        }

        data.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        try {
            // @ts-ignore
            const updated = await urlRepository.update(id, userId, data);
            if (!updated) {
                logger.warn(`URL com ID ${id} não encontrada`);
                throw new Error('URL não encontrada');
            }
            logger.info(`URL com ID ${id} atualizada com sucesso`);
            return updated;
        } catch (error: any) {
            logger.error(`Erro ao atualizar URL com ID ${id}: ${error.message}`);
            throw new Error('Erro ao atualizar URL');
        }
    }


    async deleteUrl(id: number, userId: number | null) {
        if (isNaN(id)) {
            logger.warn(`ID inválido fornecido: ${id}`);
            throw new Error('ID inválido');
        }
        const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        try {
            const deleted = await urlRepository.delete(id, deletedAt, userId);
            if (!deleted) {
                logger.warn(`URL com ID ${id} não encontrada`);
                throw new Error('URL não encontrada');
            }
            logger.info(`URL com ID ${id} deletada com sucesso`);
            return deleted;
        } catch (error : any) {
            logger.error(`Erro ao excluir URL com ID ${id}: ${error.message}`);
            throw new Error('Erro ao excluir URL');
        }
    }
}

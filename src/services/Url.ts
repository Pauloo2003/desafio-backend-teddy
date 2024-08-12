import validator from 'validator';
import { UrlRepository } from '../repositories/Url';
import bcrypt from 'bcrypt';
const urlRepository = new UrlRepository();
import moment from 'moment-timezone';
import {Op} from "sequelize";
import {shortUrlRedirect} from "../controllers/Url";
import {Logger} from "sequelize/types/utils/logger";
moment.tz.setDefault('America/Sao_Paulo');
const saltRounds = 10;

const domain = process.env.NODE_ENV === 'production' ? process.env.URL_PRODUCTION : `${process.env.URL_DEV}:${process.env.PORT}`;
export class UrlService {
    async getUrls(userId: number | null) {
        return urlRepository.findAll(userId);
    }

    async getUrlById(id: number) {
        const url = await urlRepository.findById(id);
        if (!url) throw new Error('Url not found');
        return url;
    }
    async shortUrlRedirect(shortUrl: string) {
        try {
            // Buscar a URL original usando a URL curta
            const urlRecord : any = await urlRepository.findOne({ where: { shortUrl } });

            if (!urlRecord) {
                throw new Error('URL não encontrada');
            }
            // Incrementar o contador de cliques

            const  updatedAt : string = moment().format('YYYY-MM-DD HH:mm:ss');
            await urlRepository.update(urlRecord[0].id, { clicks: Number(urlRecord[0].clicks + 1) ,updatedAt  });

            // Redirecionar para a URL original
            return (urlRecord[0].originalUrl);
        } catch (error) {
            console.error('Erro ao redirecionar:', error);
            throw new Error('Erro ao redirecionar');
        }
    }

    async createUrl(data: { urlOriginal: string , userId: number | null }) {
        const { urlOriginal , userId } = data;
        // Verificar se todos os campos obrigatórios estão presentes
        if (!urlOriginal) {
            throw new Error('Informe a url que deseja ser encurtada.');
        }

        const shortUrl: string = await this.generateShortUrl()

        // Data para criação e atualização da url
        const createdAt : string = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedAt : string = moment().format('YYYY-MM-DD HH:mm:ss');
        const payload = {
            originalUrl: urlOriginal,
            shortUrl,
            clicks: 0,
            createdAt,
            updatedAt,
            userId: userId || null,
        }
        // Criação do usuário
        const result = urlRepository.create(payload);
        return `${domain}/${shortUrl}`;
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

    async updateUrl(id: number, data:  {  name?: string; email?: string , phone?: string , updatedAt: string; }) {
        data.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const [updated] = await urlRepository.update(id, data);
        if (!updated) throw new Error('Url not found');
        return updated;
    }

    async deleteUrl(id: number, userId: number | null) {
        const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const deleted = await urlRepository.delete(id,deletedAt,userId);
        if (!deleted) throw new Error('Url not found');
        return deleted;
    }
}

import { Url } from '../models/Url';
import { Op } from 'sequelize';
import logger from '../utils/logger';

export class UrlRepository {
    async findAll(userId: number | null) {
        try {
            const urls = await Url.findAll({
                where: {
                    userId,
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });
            logger.info(`URLs encontradas para o usuário ID ${userId}`);
            return urls;
        } catch (error : any) {
            logger.error(`Erro ao buscar todas as URLs: ${error.message}`);
            throw new Error('Erro ao buscar URLs');
        }
    }

    async findOne(filtro: any) {
        try {
            const url = await Url.findOne(filtro);
            logger.info(`URL encontrada com filtro: ${JSON.stringify(filtro)}`);
            return url;
        } catch (error : any) {
            logger.error(`Erro ao buscar URL com filtro: ${error.message}`);
            throw new Error('Erro ao buscar URL');
        }
    }

    async findById(id: number) {
        try {
            const url = await Url.findByPk(id);
            if (!url) {
                logger.warn(`URL com ID ${id} não encontrada`);
                throw new Error('URL não encontrada');
            }
            logger.info(`URL com ID ${id} encontrada`);
            return url;
        } catch (error : any) {
            logger.error(`Erro ao buscar URL com ID ${id}: ${error.message}`);
            throw new Error('Erro ao buscar URL');
        }
    }

    async create(data: { originalUrl: string; shortUrl: string; clicks: number; createdAt: string; updatedAt: string }) {
        try {
            const url = await Url.create(data);
            logger.info(`URL criada com sucesso: ${JSON.stringify(data)}`);
            return url;
        } catch (error : any) {
            logger.error(`Erro ao criar URL: ${error.message}`);
            throw new Error('Erro ao criar URL');
        }
    }

    async update(id: number, userId: number | null, data: { originalUrl?: string; clicks?: number; updatedAt: string }) {
        try {
            const urlExists = await Url.findOne({ where: { id } });
            if (!urlExists) {
                logger.warn(`URL com ID ${id} não encontrada`);
                throw new Error('URL não encontrada');
            }
            const urlEnable = await Url.findOne({ where: { id, userId } });
            if (!urlEnable) {
                logger.warn(`URL com ID ${id} não pertence ao usuário ID ${userId}`);
                throw new Error('URL não pertence ao usuário, portanto não pode ser editada');
            }
            const [updated] = await Url.update(data, { where: { id } });
            if (updated === 0) {
                logger.warn(`Nenhuma URL atualizada com ID ${id}`);
                throw new Error('Ocorreu um erro ao atualizar a URL');
            }
            logger.info(`URL com ID ${id} atualizada com sucesso`);
            return updated;
        } catch (error : any) {
            logger.error(`Erro ao atualizar URL com ID ${id}: ${error.message}`);
            throw new Error('Erro ao atualizar URL');
        }
    }

    async updateClicks(id: number, data: { clicks?: number; updatedAt: string }) {
        try {
            const [updated] = await Url.update(data, { where: { id } });
            if (updated === 0) {
                logger.warn(`Nenhuma atualização de cliques para URL com ID ${id}`);
                throw new Error('Ocorreu um erro ao atualizar a URL');
            }
            logger.info(`Cliques atualizados para URL com ID ${id}`);
            return updated;
        } catch (error : any) {
            logger.error(`Erro ao atualizar cliques da URL com ID ${id}: ${error.message}`);
            throw new Error('Erro ao atualizar URL');
        }
    }

    async delete(id: number, deletedAt: string, deletedBy: number | null) {
        try {
            const urlExists = await Url.findOne({ where: { id } });
            if (!urlExists) {
                logger.warn(`URL com ID ${id} não encontrada`);
                throw new Error('URL não encontrada');
            }
            const urlEnable = await Url.findOne({ where: { id, userId: deletedBy } });
            if (!urlEnable) {
                logger.warn(`URL com ID ${id} não pertence ao usuário ID ${deletedBy}`);
                throw new Error('URL não pertence ao usuário, portanto não pode ser excluída');
            }
            const [deleted] = await Url.update(
                { deletedAt, deletedBy },
                { where: { id } }
            );
            if (deleted === 0) {
                logger.warn(`Falha ao excluir URL com ID ${id}`);
                throw new Error('Falha ao excluir URL');
            }
            logger.info(`URL com ID ${id} excluída com sucesso`);
            return deleted;
        } catch (error : any) {
            logger.error(`Erro ao excluir URL com ID ${id}: ${error.message}`);
            throw new Error('Erro ao excluir URL');
        }
    }
}

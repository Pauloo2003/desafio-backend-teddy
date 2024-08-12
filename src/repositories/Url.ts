import { Url } from '../models/Url';
import { Op } from 'sequelize';

export class UrlRepository {
    async findAll(userId: number | null) {
        try {
            return await Url.findAll({
                where: {
                    userId,
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao buscar todas as URLs:', error);
            throw new Error('Erro ao buscar URLs');
        }
    }

    async findOne(filtro: any) {
        try {
            return await Url.findOne(filtro);
        } catch (error) {
            console.error('Erro ao buscar URL com filtro:', error);
            throw new Error('Erro ao buscar URL');
        }
    }

    async findById(id: number) {
        try {
            const url = await Url.findByPk(id);
            if (!url) {
                throw new Error('URL não encontrada');
            }
            return url;
        } catch (error) {
            console.error(`Erro ao buscar URL com ID ${id}:`, error);
            throw new Error('Erro ao buscar URL');
        }
    }

    async create(data: { originalUrl: string; shortUrl: string; clicks: number; createdAt: string; updatedAt: string }) {
        try {
            return await Url.create(data);
        } catch (error) {
            console.error('Erro ao criar URL:', error);
            throw new Error('Erro ao criar URL');
        }
    }

    async update(id: number, userId: number | null, data: { originalUrl?: string; clicks?: number; updatedAt: string }) {
        try {
            const urlExists = await Url.findOne({ where: { id } });
            if (!urlExists) {
                throw new Error('URL não encontrada');
            }
            const urlEnable = await Url.findOne({ where: { id, userId } });
            if (!urlEnable) {
                throw new Error('URL não pertence ao usuário, portanto não pode ser editada');
            }
            const result = await Url.update(data, { where: { id } });
            if (result[0] === 0) {
                throw new Error('Ocorreu um erro ao atualizar a URL');
            }
            return result;
        } catch (error) {
            console.error(`Erro ao atualizar URL com ID ${id}:`, error);
            throw new Error('Erro ao atualizar URL');
        }
    }

    async updateClicks(id: number, data: { clicks?: number; updatedAt: string }) {
        try {
            const result = await Url.update(data, { where: { id } });
            if (result[0] === 0) {
                throw new Error('Ocorreu um erro ao atualizar a URL');
            }
            return result;
        } catch (error) {
            console.error(`Erro ao atualizar cliques da URL com ID ${id}:`, error);
            throw new Error('Erro ao atualizar URL');
        }
    }

    async delete(id: number, deletedAt: string, deletedBy: number | null) {
        try {
            const urlExists = await Url.findOne({ where: { id } });
            if (!urlExists) {
                throw new Error('URL não encontrada');
            }
            const urlEnable = await Url.findOne({ where: { id, userId: deletedBy } });
            if (!urlEnable) {
                throw new Error('URL não pertence ao usuário, portanto não pode ser excluída');
            }
            const result = await Url.update(
                { deletedAt, deletedBy },
                { where: { id } }
            );
            if (result[0] === 0) {
                throw new Error('Falha ao excluir URL');
            }
            return result;
        } catch (error) {
            console.error(`Erro ao excluir URL com ID ${id}:`, error);
            throw new Error('Erro ao excluir URL');
        }
    }
}

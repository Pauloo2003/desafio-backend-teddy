import { Url } from '../models/Url';
import { Op } from 'sequelize';

export class UrlRepository {
    async findAll() {
        try {
            return await Url.findAll({
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });
        } catch (error) {
            console.error('Error fetching all URLs:', error);
            throw new Error('Error fetching URLs');
        }
    }

    async findOne(filtro: any) {
        try {
            return await Url.findAll(filtro);
        } catch (error) {
            console.error('Error fetching URL with filter:', error);
            throw new Error('Error fetching URL');
        }
    }

    async findById(id: number) {
        try {
            const url = await Url.findByPk(id);
            if (!url) {
                throw new Error('URL not found');
            }
            return url;
        } catch (error) {
            console.error(`Error fetching URL with ID ${id}:`, error);
            throw new Error('Error fetching URL');
        }
    }

    async create(data: { originalUrl: string; shortUrl: string; clicks: number , createdAt: string , updatedAt: string }) {
        try {
            return await Url.create(data);
        } catch (error) {
            console.error('Error creating URL:', error);
            throw new Error('Error creating URL');
        }
    }

    async update(id: number, data: { originalUrl?: string; clicks?: number }) {
        console.log('clicks', data.clicks);
        try {
            const result = await Url.update(data, { where: { id } });
            if (result[0] === 0) {
                throw new Error('URL not found or no changes made');
            }
            return result;
        } catch (error) {
            console.error(`Error updating URL with ID ${id}:`, error);
            throw new Error('Error updating URL');
        }
    }

    async delete(id: number, deletedAt: string, deletedBy: number) {
        try {
            const urlExists = await Url.findOne({ where: { id } });
            if (!urlExists) {
                throw new Error('URL not found');
            }

            const result = await Url.update(
                { deletedAt, deletedBy },
                { where: { id } }
            );

            if (result[0] === 0) {
                throw new Error('Failed to delete URL');
            }

            return result;
        } catch (error) {
            console.error(`Error deleting URL with ID ${id}:`, error);
            throw new Error('Error deleting URL');
        }
    }
}

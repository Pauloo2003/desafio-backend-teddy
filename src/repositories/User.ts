import { User } from '../models/User';
import { Op } from 'sequelize';

export class Users {
    async findAll() {
        try {
            return await User.findAll({
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });
        } catch (error) {
            throw new Error('Erro ao buscar todos os usuários');
        }
    }

    async findOne(filtro: any) {
        try {
            return await User.findAll(filtro);
        } catch (error) {
            throw new Error('Erro ao buscar usuário com o filtro fornecido');
        }
    }

    async findById(id: number) {
        try {
            const user = await User.findByPk(id);
            if (!user) throw new Error('Usuário não encontrado');
            return user;
        } catch (error) {
            throw new Error('Erro ao buscar usuário por ID');
        }
    }

    async create(data: { name: string; email: string; password: string; phone: string; createdAt: string; updatedAt: string }) {
        try {
            return await User.create(data);
        } catch (error) {
            throw new Error('Erro ao criar usuário');
        }
    }

    async update(id: number, data: { name?: string; email?: string; phone?: string; updatedAt: string }) {
        try {
            const [updated] = await User.update(data, { where: { id } });
            if (updated === 0) throw new Error('Usuário não encontrado');
            return updated;
        } catch (error) {
            throw new Error('Erro ao atualizar usuário');
        }
    }

    async delete(id: number, deletedAt: string, deletedBy: number) {
        try {
            const userExists = await User.findOne({ where: { id } });

            if (!userExists) {
                throw new Error('Usuário não encontrado');
            }

            return await User.update(
                { deletedAt, deletedBy },
                { where: { id } }
            );
        } catch (error) {
            throw new Error('Erro ao deletar usuário');
        }
    }
}

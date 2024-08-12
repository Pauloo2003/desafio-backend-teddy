import { User } from '../models/User';
import { Op } from 'sequelize';
import logger from '../utils/logger';

export class Users {
    async findAll() {
        try {
            const users = await User.findAll({
                where: {
                    deletedAt: {
                        [Op.is]: null
                    }
                }
            });
            logger.info('Todos os usuários foram encontrados com sucesso');
            return users;
        } catch (error : any) {
            logger.error(`Erro ao buscar todos os usuários: ${error.message}`);
            throw new Error('Erro ao buscar todos os usuários');
        }
    }

    async findOne(filtro: any) {
        try {
            const user = await User.findAll(filtro);
            logger.info(`Usuário encontrado com filtro: ${JSON.stringify(user)}`);
            return user;
        } catch (error : any) {
            logger.error(`Erro ao buscar usuário com o filtro fornecido: ${error.message}`);
            throw new Error('Erro ao buscar usuário com o filtro fornecido');
        }
    }

    async findById(id: number) {
        try {
            const user = await User.findByPk(id);
            if (!user) {
                logger.warn(`Usuário com ID ${id} não encontrado`);
                throw new Error('Usuário não encontrado');
            }
            logger.info(`Usuário com ID ${id} encontrado`);
            return user;
        } catch (error : any) {
            logger.error(`Erro ao buscar usuário por ID ${id}: ${error.message}`);
            throw new Error('Erro ao buscar usuário por ID');
        }
    }

    async create(data: { name: string; email: string; password: string; phone: string; createdAt: string; updatedAt: string }) {
        console.log(data)
        try {
            const user = await User.create(data);
            logger.info(`Usuário criado com sucesso: ${JSON.stringify(data)}`);
            return user;
        } catch (error : any) {
            logger.error(`Erro ao criar usuário: ${error.message}`);
            throw new Error('Erro ao criar usuário');
        }
    }

    async update(id: number, data: { name?: string; email?: string; phone?: string; updatedAt: string }) {
        try {
            const [updated] = await User.update(data, { where: { id } });
            if (updated === 0) {
                logger.warn(`Usuário com ID ${id} não encontrado para atualização`);
                throw new Error('Usuário não encontrado');
            }
            logger.info(`Usuário com ID ${id} atualizado com sucesso`);
            return updated;
        } catch (error : any) {
            logger.error(`Erro ao atualizar usuário com ID ${id}: ${error.message}`);
            throw new Error('Erro ao atualizar usuário');
        }
    }

    async delete(id: number, deletedAt: string, deletedBy: number) {
        try {
            const userExists = await User.findOne({ where: { id } });

            if (!userExists) {
                logger.warn(`Usuário com ID ${id} não encontrado para exclusão`);
                throw new Error('Usuário não encontrado');
            }

            const [deleted] = await User.update(
                { deletedAt, deletedBy },
                { where: { id } }
            );
            if (deleted === 0) {
                logger.warn(`Falha ao deletar usuário com ID ${id}`);
                throw new Error('Falha ao deletar usuário');
            }
            logger.info(`Usuário com ID ${id} excluído com sucesso`);
            return deleted;
        } catch (error : any) {
            logger.error(`Erro ao deletar usuário com ID ${id}: ${error.message}`);
            throw new Error('Erro ao deletar usuário');
        }
    }
}

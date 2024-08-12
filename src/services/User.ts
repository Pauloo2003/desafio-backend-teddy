import validator from 'validator';
import { Users } from '../repositories/User';
import bcrypt from 'bcrypt';
import moment from 'moment-timezone';
import { Op } from 'sequelize';
import logger from '../utils/logger';

const userRepository = new Users();
moment.tz.setDefault('America/Sao_Paulo');
const saltRounds = 10;

export class User {
    async getUsers() {
        try {
            const users = await userRepository.findAll();
            logger.info('Usuários recuperados com sucesso.');
            return users;
        } catch (error : any) {
            logger.error(`Erro ao buscar usuários: ${error.message}`);
            throw new Error('Erro ao buscar usuários');
        }
    }

    async getUserById(id: number) {
        try {
            const user = await userRepository.findById(id);
            if (!user) {
                logger.warn(`Usuário com ID ${id} não encontrado.`);
                throw new Error('Usuário não encontrado');
            }
            logger.info(`Usuário com ID ${id} recuperado com sucesso.`);
            return user;
        } catch (error : any) {
            logger.error(`Erro ao buscar usuário por ID ${id}: ${error.message}`);
            throw new Error('Erro ao buscar usuário por ID');
        }
    }

    async createUser(data: { name: string; email: string; password: string; phone: string }) {
        const { name, email, password, phone } = data;

        // Verificar se todos os campos obrigatórios estão presentes
        if (!name) {
            logger.warn('O campo nome é obrigatório.');
            throw new Error('O campo nome é obrigatório.');
        }

        if (!email) {
            logger.warn('O campo e-mail é obrigatório.');
            throw new Error('O campo e-mail é obrigatório.');
        }

        if (!password) {
            logger.warn('O campo senha é obrigatório.');
            throw new Error('O campo senha é obrigatório.');
        }

        if (!phone) {
            logger.warn('O campo telefone é obrigatório.');
            throw new Error('O campo telefone é obrigatório.');
        }

        // Validar o formato do email

        if (!validator.isEmail(email)) {
            logger.warn('E-mail inválido');
            throw new Error('E-mail inválido');
        }

        // Verificar se o email já existe no banco de dados e o usuário não está deletado
        const existingUser = await userRepository.findOne({
            where: {
                email,
                deletedAt: {
                    [Op.is]: null
                }
            }
        });

        if (existingUser.length > 0) {
            logger.warn('O e-mail já está em uso');
            throw new Error('O e-mail já está em uso');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            const newUser = await userRepository.create({
                name,
                email,
                password: hashedPassword,
                phone,
                createdAt,
                updatedAt
            });
            logger.info(`Novo usuário criado com ID ${newUser.id}`);
            return newUser;
        } catch (error : any) {
            logger.error(`Erro ao criar usuário: ${error.message}`);
            throw new Error('Erro ao criar usuário');
        }
    }

    async updateUser(id: number, data: { name?: string; email?: string; phone?: string; updatedAt: string; }) {
        data.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            // @ts-ignore
            const updated = await userRepository.update(id, data);
            if (!updated) {
                logger.warn(`Usuário com ID ${id} não encontrado.`);
                throw new Error('Usuário não encontrado');
            }
            logger.info(`Usuário com ID ${id} atualizado com sucesso.`);
            return updated;
        } catch (error : any) {
            logger.error(`Erro ao atualizar usuário com ID ${id}: ${error.message}`);
            throw new Error('Erro ao atualizar usuário');
        }
    }

    async deleteUser(id: number, userId: number) {
        const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            const deleted = await userRepository.delete(id, deletedAt, userId);
            if (!deleted) {
                logger.warn(`Usuário com ID ${id} não encontrado.`);
                throw new Error('Usuário não encontrado');
            }
            logger.info(`Usuário com ID ${id} deletado com sucesso.`);
            return deleted;
        } catch (error : any) {
            logger.error(`Erro ao deletar usuário com ID ${id}: ${error.message}`);
            throw new Error('Erro ao deletar usuário');
        }
    }
}

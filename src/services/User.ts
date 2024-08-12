import validator from 'validator';
import { Users } from '../repositories/User';
import bcrypt from 'bcrypt';
import moment from 'moment-timezone';
import { Op } from 'sequelize';

const userRepository = new Users();
moment.tz.setDefault('America/Sao_Paulo');
const saltRounds = 10;

export class User {
    async getUsers() {
        try {
            return await userRepository.findAll();
        } catch (error) {
            throw new Error('Erro ao buscar usuários');
        }
    }

    async getUserById(id: number) {
        try {
            const user = await userRepository.findById(id);
            if (!user) throw new Error('Usuário não encontrado');
            return user;
        } catch (error) {
            throw new Error('Erro ao buscar usuário por ID');
        }
    }

    async createUser(data: { name: string; email: string; password: string; phone: string }) {
        const { name, email, password, phone } = data;

        // Verificar se todos os campos obrigatórios estão presentes
        if (!name) {
            throw new Error('O campo nome é obrigatório.');
        }

        if (!email) {
            throw new Error('O campo e-mail é obrigatório.');
        }

        if (!password) {
            throw new Error('O campo senha é obrigatório.');
        }

        if (!phone) {
            throw new Error('O campo telefone é obrigatório.');
        }

        // Validar o formato do email
        if (!validator.isEmail(email)) {
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
            throw new Error('O e-mail já está em uso');
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Dados para criação do usuário
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

        // Criação do usuário
        try {
            return await userRepository.create({
                name,
                email,
                password: hashedPassword,
                phone,
                createdAt,
                updatedAt
            });
        } catch (error) {
            throw new Error('Erro ao criar usuário');
        }
    }

    async updateUser(id: number, data: { name?: string; email?: string; phone?: string; updatedAt: string; }) {
        data.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            const [updated] = await userRepository.update(id, data);
            if (!updated) throw new Error('Usuário não encontrado');
            return updated;
        } catch (error) {
            throw new Error('Erro ao atualizar usuário');
        }
    }

    async deleteUser(id: number, userId: number) {
        const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');

        try {
            const deleted = await userRepository.delete(id, deletedAt, userId);
            if (!deleted) throw new Error('Usuário não encontrado');
            return deleted;
        } catch (error) {
            throw new Error('Erro ao deletar usuário');
        }
    }
}

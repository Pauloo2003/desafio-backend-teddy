import validator from 'validator';
import { UserRepository } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
const userRepository = new UserRepository();
import moment from 'moment-timezone';
import {Op} from "sequelize";
moment.tz.setDefault('America/Sao_Paulo');
const saltRounds = 10;
export class UserService {
    async getUsers() {
        return userRepository.findAll();
    }

    async getUserById(id: number) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('User not found');
        return user;
    }

    async createUser(data: { name: string; email: string; password: string; phone: string }) {
        const { name, email, password, phone } = data;

        // Verificar se todos os campos obrigatórios estão presentes
        if (!name) {
            throw new Error('O campo name é obrigatório.');
        }

        if (!email) {
            throw new Error('O campo email é obrigatório.');
        }

        if (!password) {
            throw new Error('O campo password é obrigatório.');
        }

        if (!phone) {
            throw new Error('O campo phone é obrigatório.');
        }

        // Validar o formato do email
        if (!validator.isEmail(email)) {
            throw new Error('Email inválido');
        }

        // Verificar se o email já existe no banco de dados e o usuario nao esta deletado
        const existingUser = await userRepository.findOne({ where: { email , deletedAt: {
                    [Op.is]: null
                } } });

        if (existingUser.length > 0) {
            throw new Error('O email já está em uso');
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Dados para criação do usuário
        const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');

        // Criação do usuário
        return userRepository.create({
            name,
            email,
            password: hashedPassword,
            phone,
            createdAt,
            updatedAt
        });
    }

    async updateUser(id: number, data: {  name?: string; email?: string , phone?: string , updatedAt: string; }) {
        data.updatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const [updated] = await userRepository.update(id, data);
        if (!updated) throw new Error('User not found');
        return updated;
    }

    async deleteUser(id: number, userId: number) {
        const deletedAt = moment().format('YYYY-MM-DD HH:mm:ss');
        const deleted = await userRepository.delete(id,deletedAt,userId);
        if (!deleted) throw new Error('User not found');
        return deleted;
    }
}

import {User} from '../models/User';
import {Op} from "sequelize";

export class UserRepository {
    async findAll() {
        return User.findAll({
            where: {
                deletedAt: {
                    [Op.is]: null
                }
            }
        });
    }

    async findOne(filtro : any) {
        return User.findAll(filtro);
    }
    async findById(id: number) {
        return User.findByPk(id);
    }

    async create(data: { name: string; email: string , password: string, phone: string }) {
        return User.create(data);
    }

    async update(id: number, data: { name?: string; email?: string }) {
        return User.update(data, { where: { id } });
    }

    async delete(id: number , deletedAt: string , deletedBy: number) {
        const userExists = await User.findOne({ where: { id } });

        if (!userExists) {
            throw new Error('User not found');
        }

        return User.update(
            { deletedAt , deletedBy},
            { where: { id } }
        );
    }
}

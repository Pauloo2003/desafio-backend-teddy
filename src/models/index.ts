import { Sequelize } from 'sequelize';
import sequelize from '../config/database';
import { User } from './User';
import { Url } from './Url';


const db: { sequelize: Sequelize; User: typeof User; Url: typeof Url } = {
    sequelize,
    User,
    Url,
};

export default db;

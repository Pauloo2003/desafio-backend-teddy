import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class User extends Model {
    public id!: number;
    public name!: string;
    public email!: string;
    public password!: string;
    public phone!: string;
    public createdAt!: string;
    public updatedAt!: string;
    public deletedAt!: string | null;
    public deletedBy!: number | null;
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(75),
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING(155),
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING(45),
            allowNull: false,
            unique: true,
        },
        createdAt: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        updatedAt: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        deletedAt: {
            type: DataTypes.STRING(30),
            allowNull: true,
        },
        deletedBy: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: false,
    }
);

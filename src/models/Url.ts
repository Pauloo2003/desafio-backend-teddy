import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import {User} from './User';

export class Url extends Model {
    public id!: number;
    public originalUrl!: string;
    public shortUrl!: string;
    public userId!: number | null;
    public clicks!: number;
    public createdAt!: string;
    public updatedAt!: string;
    public deletedAt!: string | null;
    public deletedBy!: number | null;
}

Url.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        originalUrl: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        shortUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        userId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: {
                model: User,
                key: 'id',
            },
        },
        clicks: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
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
        modelName: 'urls',
        timestamps: false,
    }
);



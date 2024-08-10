import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { Url } from './Url';

class UrlClick extends Model {
    public id!: number;
    public urlId!: number;
    public accessedAt!: Date;
}

UrlClick.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        urlId: {
            type: DataTypes.INTEGER,
            references: {
                model: Url,
                key: 'id',
            },
        },
        accessedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: 'UrlClick',
    }
);

export default UrlClick;

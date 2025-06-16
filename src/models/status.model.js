'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Status extends Model {
        static associate(models) {
            Status.hasMany(models.Order, { foreignKey: 'status_id' });
        }
    }

    Status.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            }
        },
        {
            sequelize,
            modelName: 'Status',
            tableName: 'statuses',
            timestamps: false,
            underscored: true
        }
    );

    return Status;
};

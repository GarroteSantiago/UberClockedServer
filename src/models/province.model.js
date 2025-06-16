'use strict';

const { Model, Sequelize } = require('sequelize');

/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class Province extends Model {
        static associate(models) {
            Province.belongsTo(models.Country, {
                foreignKey: 'country_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });

            Province.hasMany(models.Ubication, {
                foreignKey: 'province_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }

    Province.init(
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
            },
            country_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'countries',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'Province',
            tableName: 'provinces',
            timestamps: false,
        }
    );

    return Province;
};

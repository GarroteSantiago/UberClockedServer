'use strict';

const { Model, Sequelize } = require('sequelize');


/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class Ubication extends Model{
        static associate(models) {
            Ubication.belongsTo(models.Country, {
                foreignKey: 'country_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            Ubication.belongsTo(models.Province, {
                foreignKey: 'province_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            Ubication.belongsTo(models.Locality, {
                foreignKey: 'locality_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
    }

    Ubication.init
    (
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            country_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'countries',
                    key: 'id'
                }
            },
            province_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'provinces',
                    key: 'id'
                }
            },
            locality_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'localities',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'Ubication',
            tableName: 'ubications',
            timestamps: false,
        }
    );

    return Ubication;
};

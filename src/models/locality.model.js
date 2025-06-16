'use strict';

const { Model, Sequelize } = require('sequelize');

/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class Locality extends Model {
        static associate(models) {
            Locality.belongsTo(models.Province, {
                foreignKey: 'province_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });

            Locality.hasMany(models.Ubication, {
                foreignKey: 'locality_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }

    Locality.init(
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
            province_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'provinces',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'Locality',
            tableName: 'localities',
            timestamps: false,
        }
    );

    return Locality;
};

'use strict';

const { Model, Sequelize } = require('sequelize');

/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class Country extends Model {
        static associate(models) {
            Country.hasMany(models.Ubication, {
                foreignKey: 'country_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
    }

    Country.init
    (
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
            modelName: 'Country',
            tableName: 'countries',
            timestamps: false,
        }
    );

    return Country;
};

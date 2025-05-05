'use strict';

const { Model, Sequelize } = require('sequelize');


/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class Ubication extends Model{}

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
                    model: 'Country',
                    key: 'id'
                }
            },
            province_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'Province',
                    key: 'id'
                }
            },
            locality_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'Locality',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'Ubication',
            tableName: 'ubications'
        }
    );

    return Ubication;
};

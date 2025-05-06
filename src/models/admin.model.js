'use strict';

const { Model, Sequelize } = require('sequelize');


/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model{
        static associate(models) {
            Admin.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
    }

    Admin.init
    (
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                }
            }
        },
        {
            sequelize,
            modelName: 'Admin',
            tableName: 'admins',
            timestamps: false,
        }
    );

    return Admin;
};

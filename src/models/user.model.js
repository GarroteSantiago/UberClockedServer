'use strict';

const { Model, Sequelize } = require('sequelize');


/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class User extends Model{
        associate(models) {
            User.hasOne(models.Admin, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            User.hasMany(models.ShoppingCart, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
    }

    User.init
    (
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true
            },
            name_tag: {
                type: DataTypes.STRING,
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false
            },
            ubication: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'ubications',
                    key: 'id',
                }
            },
            postal_code: {
                type: DataTypes.STRING,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users'
        }
    );

    return User;
};

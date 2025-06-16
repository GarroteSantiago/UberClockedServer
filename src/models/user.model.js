'use strict';

const { Model, Sequelize } = require('sequelize');


/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class User extends Model{
        static associate(models) {
            User.belongsTo(models.Role, {
                foreignKey: 'role_id',
                onDelete: 'RESTRICT',
                onUpdate: 'CASCADE',
            })
            User.belongsTo(models.Ubication, {
                foreignKey: 'ubication_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            User.hasMany(models.ShoppingCart, {
                foreignKey: 'user_id',
                as: 'ShoppingCart',
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
            role_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                onDelete: 'RESTRICT',
                references: {
                    model: 'roles',
                    key: 'id'
                }
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
            ubication_id: {
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

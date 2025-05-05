'use strict';

const { Model, Sequelize } = require('sequelize');


/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class ShoppingCart extends Model{
        static associate(models) {
            ShoppingCart.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            ShoppingCart.belongsToMany(models.Product, {
                through: models.CartProduct,
                foreignKey: 'shopping_cart_id',
                otherKey: 'product_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE'
            })
        }
    }

    ShoppingCart.init
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
                    key: 'id',
                }
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
        },
        {
            sequelize,
            modelName: 'ShoppingCart',
            tableName: 'shopping_carts'
        }
    );

    return ShoppingCart;
};

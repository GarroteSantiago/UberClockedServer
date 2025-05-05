'use strict';

const { Model, Sequelize } = require('sequelize');


/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class ShoppingCart extends Model{
        associate(models) {
            ShoppingCart.belongsTo(models.User, {
                foreignKey: 'user_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            ShoppingCart.belongsToMany(models.Products, {
                through: models.CartProduct,
                foreignKey: 'shopping_cart_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                otherKey: 'product_id',
                as: 'products'
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
                    model: 'User',
                    key: 'id',
                }
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false
            },
            last_modification: {
                type: DataTypes.DATE,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            is_active: {
                type: DataTypes.BOOLEAN,
                allowNull: false
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

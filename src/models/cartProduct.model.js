'use strict';

const { Model, Sequelize } = require('sequelize');
const {union} = require("zod");


/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class CartProduct extends Model{}

    CartProduct.init
    (
        {
            shopping_cart_id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                onDelete: 'CASCADE',
                references: {
                    model: 'ShoppingCart',
                    key: 'id'
                }
            },
            product_id: {
                type: DataTypes.BIGINT,
                onDelete: 'CASCADE',
                primaryKey: true,
                references: {
                    model: 'Product',
                    key: 'id'
                }
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            }
        },
        {
            sequelize,
            modelName: 'CartProduct',
            tableName: 'carts_products',
            indexes: [
                {
                    unique: true,
                    fields: ['shopping_cart_id', 'product_id'],
                }
            ]
        }
    );

    return CartProduct;
};

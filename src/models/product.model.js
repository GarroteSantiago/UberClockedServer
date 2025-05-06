'use strict';

const { Model, Sequelize } = require('sequelize');

/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {

    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Component, {
                foreignKey: 'component_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            Product.belongsToMany(models.ShoppingCart, {
                through: models.CartProduct,
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
                otherKey: 'shopping_cart_id',
            })
        }
    }

    Product.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        } ,
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image_url:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        image_alt:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        component_id:{
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: 'components',
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        price: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: false,
    });

    return Product;
};

'use strict';

const { Model, Sequelize } = require('sequelize');

/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {

    class ProductFieldValue extends Model {
        static associate(models) {
            ProductFieldValue.belongsTo(models.Product, {
                foreignKey: 'product_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            ProductFieldValue.belongsTo(models.ProductField, {
                foreignKey: 'product_field_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
        }
    }

    ProductFieldValue.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        product_field_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        value: {
            type: DataTypes.TEXT,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: 'ProductFieldValue',
        tableName: 'products_fields_values',
        timestamps: false,
    });

    return ProductFieldValue;
};

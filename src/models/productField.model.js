'use strict';

const { Model, Sequelize } = require('sequelize');

/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {

    class ProductField extends Model {
        static associate(models) {
            ProductField.belongsTo(models.Component, {
                foreignKey: 'component_id',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            })
            ProductField.hasMany(models.ProductFieldValue, {
                foreignKey: 'product_field_id',
            })
        }
    }

    ProductField.init({
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        } ,
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        field_type: {
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
        }
    }, {
        sequelize,
        modelName: 'ProductField',
        tableName: 'products_fields',
        timestamps: false,
    });

    return ProductField;
};

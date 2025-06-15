'use strict';

const { Model, Sequelize } = require('sequelize');

/**
 * @param {Sequelize} sequelize
 * @param {typeof import('sequelize').DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: 'user_id' });
            Order.belongsTo(models.ShoppingCart, { foreignKey: 'cart_id' });
            Order.belongsTo(models.Status, { foreignKey: 'status_id' });
            Order.belongsTo(models.Invoice, { foreignKey: 'invoice_id' });
        }
    }

    Order.init(
        {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE'
            },
            cart_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'shopping_carts',
                    key: 'id',
                },
                onDelete: 'RESTRICT'
            },
            status_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'statuses',
                    key: 'id',
                },
                onDelete: 'RESTRICT'
            },
            invoice_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                references: {
                    model: 'invoices',
                    key: 'id',
                },
                onDelete: 'RESTRICT'
            }
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'orders',
            timestamps: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at',
        }
    );

    return Order;
};

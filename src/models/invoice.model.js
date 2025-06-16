'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Invoice extends Model {
        static associate(models) {
            Invoice.belongsTo(models.User, { foreignKey: 'user_id' });
            Invoice.hasOne(models.Order, { foreignKey: 'invoice_id' });
        }
    }

    Invoice.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
                onDelete: 'SET NULL',
                references: {
                    model: 'users',
                    key: 'id',
                }
            },
            amount: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            payment_date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            payment_method: {
                type: DataTypes.STRING,
                allowNull: true,
            }
        },
        {
            sequelize,
            modelName: 'Invoice',
            tableName: 'invoices',
            timestamps: true,
            underscored: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at',
        }
    );

    return Invoice;
};

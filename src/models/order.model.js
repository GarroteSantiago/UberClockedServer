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
            value: {
                type: DataTypes.FLOAT,
                allowNull: false,
                defaultValue: 0,
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
            delivery_date: {
                type: DataTypes.DATE,
                allowNull: true,
                defaultValue: null,
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
    Order.addHook('beforeCreate', async (order, options) => {
        const { ShoppingCart, Product, User, Role } = sequelize.models;

        const cart = await ShoppingCart.findByPk(order.cart_id, {
            include: {
                model: Product,
                through: { attributes: ['quantity'] }
            }
        });

        const user = await User.findByPk(order.user_id, {
            include: {
                model: Role,
            }
        })

        if (!cart) throw new Error('Cart not found');

        let total = 0;
        for (const product of cart.Products) {
            const quantity = product.CartProduct.quantity;
            total += product.price * quantity;
        }

        console.log(user);

        if (user.Role.name === 'organization') {
            order.value = total * .89;
        } else {
            order.value = total;
        }
    });
    Order.addHook('afterCreate', async (order, options) => {
        // hook 1: generar invoice
        const { Invoice } = sequelize.models;
        const invoice = await Invoice.create({
            user_id: order.user_id,
            amount: order.value,
            payment_method: order.payment_method || 'N/A',
        });
        order.invoice_id = invoice.id;
        await order.save({ transaction: options.transaction });

        // hook 2: desactivar carrito
        const { ShoppingCart } = sequelize.models;
        const cart = await ShoppingCart.findByPk(order.cart_id);
        if (cart && cart.is_active) {
            cart.is_active = false;
            await cart.save({ transaction: options.transaction });
        }
    });


    return Order;
};


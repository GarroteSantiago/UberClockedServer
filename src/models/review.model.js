'use strict';

const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Review extends Model {
        static associate(models) {
            Review.belongsTo(models.User, { foreignKey: 'user_id' });
            Review.belongsTo(models.Product, { foreignKey: 'product_id' });

            // Hooks deben ir después de que los modelos estén completamente cargados
            Review.addHook('afterCreate', async (review, options) => {
                await updateProductRating(models, review.product_id);
            });

            Review.addHook('afterUpdate', async (review, options) => {
                await updateProductRating(models, review.product_id);
            });

            Review.addHook('afterDestroy', async (review, options) => {
                await updateProductRating(models, review.product_id);
            });
        }
    }

    Review.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                unique: 'user_product_unique',
            },
            product_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'products',
                    key: 'id',
                },
                onDelete: 'CASCADE',
                unique: 'user_product_unique',
            },
            rating: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    min: 1,
                    max: 5,
                },
            },
            comment: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Review',
            tableName: 'reviews',
            timestamps: true,
            underscored: true,
            updatedAt: 'updated_at',
            createdAt: 'created_at',
        }
    );

    // Función auxiliar para actualizar rating promedio
    async function updateProductRating(models, productId) {
        const result = await Review.findOne({
            where: { product_id: productId },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']
            ],
            raw: true,
        });

        const avgRating = parseFloat(result.avgRating || 0).toFixed(2);

        await models.Product.update(
            { rating: avgRating },
            { where: { id: productId } }
        );
    }

    return Review;
};

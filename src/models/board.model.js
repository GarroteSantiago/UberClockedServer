'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Board extends Model {
        static associate(models) {
            Board.belongsTo(models.User, {
                foreignKey: 'owner_id',
                as: 'owner'
            });

            Board.belongsToMany(models.User, {
                through: models.BoardInterestedUsers,
                foreignKey: 'board_id',
                otherKey: 'user_id',
                as: 'interested_users'
            });
        }
    }

    Board.init(
        {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            is_available: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            owner_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            }
        },
        {
            sequelize,
            modelName: 'Board',
            tableName: 'boards',
            timestamps: true,
            underscored: true
        }
    );

    return Board;
};

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class BoardInterestedUsers extends Model {
        static associate(models) {
            BoardInterestedUsers.belongsTo(models.Board, {
                foreignKey: 'board_id'
            });

            BoardInterestedUsers.belongsTo(models.User, {
                foreignKey: 'user_id'
            });
        }
    }

    BoardInterestedUsers.init(
        {
            board_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'boards',
                    key: 'id'
                },
                onDelete: 'CASCADE'
            },
            user_id: {
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
            modelName: 'BoardInterestedUsers',
            tableName: 'board_interested_users',
            timestamps: false,
            underscored: true
        }
    );

    return BoardInterestedUsers;
};

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Comment extends Model { }

Comment.init({
    content: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Anonymous'
    }
}, {
    sequelize
});

module.exports = Comment
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcryptjs');

class User extends Model { }

User.init({
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    sequelize,
    hooks: {
        beforeCreate: user => {
            user.password = bcrypt.hashSync(user.password, 10); 
            return user;
        }
    }
});

module.exports = User;

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require("bcryptjs");

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
        validate: {
            len: [8],
            isStrongPassword: function (value) {
                if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(value)) {
                    throw new Error('Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character.');
                }
            }
        }
    }
}, {
    sequelize,
    hooks: {
        beforeCreate: user => {
            user.password = bcrypt.hashSync(user.password, 10); // Increased cost factor to 10
            return user;
        }
    }
});

module.exports = User;

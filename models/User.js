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
             len: [8]
         }
     },
 }, {
     sequelize,
     hooks: {
         beforeCreate: usersObj => {
             usersObj.password = bcrypt.hashSync(usersObj.password, 6);
             return usersObj
         }
     }
 });

 module.exports = User
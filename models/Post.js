const { Model, DataTypes } = require('sequelize');
 const sequelize = require('../config/connection');

 class Post extends Model { }

 Post.init({
     title: {
         type: DataTypes.STRING,
         allowNull: false
     },
     content: {
         type: DataTypes.STRING,
         allowNull: false
     }
 }, {
     sequelize
 });

 module.exports = Post
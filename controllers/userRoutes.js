const express = require('express');
 const router = express.Router();
 const bcrypt = require('bcryptjs');
 const { User, Post, Comment } = require('../models');

 // Show all users
 router.get(`/`, (req, res) => {
     User.findAll().then((dbUsers) => {
         res.json(dbUsers);
     }).catch(err => {
         console.log(err);
         res.status(500).json({
             error: true,
             msg: 'Internal server error',
             details: err.message,
         })
     })
 });

 module.exports = router;
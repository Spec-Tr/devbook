const express = require('express');
 const router = express.Router();
 const { User, Post, Comment } = require('../models');

 // Show all posts
 router.get(`/`, (req, res) => {
     Comment.findAll({
         include: [User, Post]
     }).then((dbComments) => {
         res.json(dbComments);
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
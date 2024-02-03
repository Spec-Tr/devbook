const express = require('express');
 const router = express.Router();
 const { User, Post, Comment } = require('../models');

 // Show all posts
 router.get(`/`, (req, res) => {
     Post.findAll({
         include: [User, Comment]
     }).then((dbPosts) => {
         res.json(dbPosts);
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
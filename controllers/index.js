const express = require('express');
 const router = express.Router();
 const { User, Post, Comment } = require("../models")

 const userRoutes = require(`./userRoutes`);
 router.use(`/api/user`, userRoutes);

 const postRoutes = require(`./postRoutes`);
 router.use(`/api/post`, postRoutes);

 const commentRoutes = require(`./commentRoutes`);
 router.use(`/api/comment`, commentRoutes);

 module.exports = router;
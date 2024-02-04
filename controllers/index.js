const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require("../models")

const userRoutes = require(`./userRoutes`);
router.use(`/api/user`, userRoutes);

const postRoutes = require(`./postRoutes`);
router.use(`/api/post`, postRoutes);

const commentRoutes = require(`./commentRoutes`);
router.use(`/api/comment`, commentRoutes);

// other routes

// Home page
router.get(`/`, (req, res) => {
  const isLoggedIn = req.session.user !== undefined;
  console.log(isLoggedIn)
  res.render("home", { isLoggedIn })
});

// Dashboard: 
router.get(`/dashboard`, (req, res) => {
  if(req.session.user){
    res.render("dashboard");
  } else {
    res.render("login")
  }    
});

// Login Page 
router.get("/login", (req, res) => {
  if (req.session.user) {
    res.redirect("/")
  } else {
    res.render("login")
  }
})

// Logout Page 
router.get(`/logout`, (req, res) => {
  res.render("logout");
});

// Display Post Page 
router.get(`/displayPost/:id`, (req, res) => {
  if(req.session.user){
    res.render(`displayPost`)
  } else {
    res.render("login")
  }    
});

// Single User Post pageBreakAfter: 
router.get(`/displayUserPost/:id`, (req, res) => {
  res.render(`displayUserPost`)
});

module.exports = router;

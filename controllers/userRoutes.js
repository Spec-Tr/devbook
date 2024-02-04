const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const { User, Post, Comment } = require('../models');

// Show all users
router.get(`/`, (req, res) => {
    User.findAll().then((dbUsers) => {
        res.json(dbUsers);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            msg: `Internal server error`,
            err
        })
    })
});

// Show by ID
router.get("/find/:id", (req, res) => {
    User.findByPk(req.params.id, {
        include: [Post, Comment]
    }).then(dbUser => {
        if (!dbUser) {
            res.status(404).json({ msg: "User not found in database" })
        } else {
            res.json(dbUser)
        }
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
});

// Create User
router.post("/", (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password
    }).then(newUser => {
        res.json(newUser)
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
})

// Login
router.post("/login", (req, res) => {
    //TODO: ensure user isnt logged in
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(foundUser => {
        if (!foundUser) {
            return res.status(401).json({
                msg: "Incorrect username and/or password"
            })
        }
        else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
            return res.status(401).json({
                msg: "Incorrect username and/or password"
            })
        }
        req.session.user = {
            id: foundUser.id,
            username: foundUser.username
        }
        res.json(foundUser)
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
})

// Logout of Session
router.get("/logout/", (req, res) => {
    req.session.destroy();
    res.send("Logged out successfully")
})

// Delete User
router.delete("/delete/", (req, res) => {
    User.destroy({
        where: {
            id: req.session.user.id
        }
    }).then(delUser=>{
        req.session.destroy()
        if(!delUser){
            res.status(404).json({msg:"User not found in database"})
        } else{
            res.json(delUser)
        }
    }).catch(err => {
        console.log(err)
        res.status(500).json({ msg: "Internal server error", err })
    })
});

// Find Session User
router.get("/session/:id", (req, res) => {
    User.findByPk(req.session.user.id, {
        include: [Post, Comment]
    }).then(dbUser => {
        if (!dbUser) {
            res.status(404).json({ msg: "User not found" })
        } else {
            res.json(dbUser)
        }
    }).catch(err => {
        res.status(500).json({ msg: "Internal server error", err })
    })
});

module.exports = router;
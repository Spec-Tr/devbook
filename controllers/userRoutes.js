const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { User, Post, Comment } = require('../models');
const { body, validationResult } = require('express-validator');

// Show all users
router.get(`/`, (req, res) => {
    User.findAll()
        .then((dbUsers) => {
            res.json(dbUsers);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({
                error: true,
                msg: 'Internal server error',
                details: err.message,
            });
        });
});

// Find user by ID
router.get('/:id', (req, res) => {
    User.findByPk(req.params.id, {
        include: [Post, Comment],
    })
        .then((dbUser) => {
            if (!dbUser) {
                res.status(404).json({ error: true, msg: 'User not found in database' });
            } else {
                res.json(dbUser);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Create User with validation/sanitization
router.post('/', [
    body('username').trim().isLength({ min: 3 }).escape(),
    body('password').isLength({ min: 8 }).escape(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, msg: 'Validation error', details: errors.array() });
    }

    User.create({
        username: req.body.username,
        password: req.body.password,
    })
        .then((newUser) => {
            res.json(newUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Login
router.post('/login', (req, res) => {
    // TODO: ensure user isn't logged in
    User.findOne({
        where: { username: req.body.username },
    })
        .then((foundUser) => {
            if (!foundUser || !bcrypt.compareSync(req.body.password, foundUser.password)) {
                return res.status(401).json({ error: true, msg: 'Incorrect username or password' });
            }

            req.session.user = {
                id: foundUser.id,
                username: foundUser.username,
            };
            res.json(foundUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Logout of Session
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.send('Logged out successfully');
});

// Delete User
router.delete('/delete', (req, res) => {
    User.destroy({
        where: { id: req.session.user.id },
    })
        .then((delUser) => {
            req.session.destroy();
            if (!delUser) {
                res.status(404).json({ error: true, msg: 'User not found in database' });
            } else {
                res.json(delUser);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Find Session User
router.get('/session/:id', (req, res) => {
    User.findByPk(req.session.user.id, {
        include: [Post, Comment],
    })
        .then((dbUser) => {
            if (!dbUser) {
                res.status(404).json({ error: true, msg: 'User not found' });
            } else {
                res.json(dbUser);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

module.exports = router;

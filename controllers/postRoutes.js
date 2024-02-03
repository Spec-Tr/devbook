const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');
const { body, validationResult } = require('express-validator');

// Show all posts
router.get('/', (req, res) => {
    Post.findAll({
        include: [User, Comment]
    })
        .then((dbPosts) => {
            res.json(dbPosts);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Show post by ID
router.get('/find/:id', (req, res) => {
    Post.findByPk(req.params.id, {
        include: [User, Comment]
    })
        .then((dbPost) => {
            if (!dbPost) {
                res.status(404).json({ error: true, msg: 'Post not found in database' });
            } else {
                res.json(dbPost);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Create Post with validation/sanitization
router.post('/', [
    body('title').trim().notEmpty().escape(),
    body('content').trim().notEmpty().escape(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, msg: 'Validation error', details: errors.array() });
    }

    Post.create({
        title: req.body.title,
        content: req.body.content,
    })
        .then((newPost) => {
            res.json(newPost);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Update Post
router.put('/edit/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title,
            content: req.body.content,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    )
        .then((editPost) => {
            res.json(editPost);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Delete Post
router.delete('/delete/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((delPost) => {
            if (!delPost) {
                res.status(404).json({ error: true, msg: 'Post not found in database' });
            } else {
                res.json({ success: true, msg: 'Post deleted successfully' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Get logged user's posts
router.get('/logged/posts', (req, res) => {
    Post.findAll({
        include: [User, Comment],
        where: {
            UserId: req.session.user.id,
        },
    })
        .then((dbPosts) => {
            res.json(dbPosts);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({
                msg: 'Internal server error',
                err,
            });
        });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');
const { body, validationResult } = require('express-validator');

// Show all comments
router.get('/', (req, res) => {
    Comment.findAll({
        include: [User, Post]
    })
        .then((dbComments) => {
            res.json(dbComments);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Show comment by ID
router.get('/:id', (req, res) => {
    Comment.findByPk(req.params.id, {
        include: [User, Post]
    })
        .then((dbComment) => {
            if (!dbComment) {
                res.status(404).json({ error: true, msg: 'Comment not found in database' });
            } else {
                res.json(dbComment);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Create Comment with validation/sanitization
router.post('/', [
    body('content').trim().notEmpty().escape(),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: true, msg: 'Validation error', details: errors.array() });
    }

    Comment.create({
        content: req.body.content,
    })
        .then((newComment) => {
            res.json(newComment);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Update Comment 
router.put('/edit/:id', (req, res) => {
    Comment.update(
        {
            content: req.body.content,
        },
        {
            where: {
                id: req.params.id,
            },
        }
    )
        .then((editComment) => {
            res.json(editComment);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Delete Comment
router.delete('/delete/:id', (req, res) => {
    Comment.destroy({
        where: {
            id: req.params.id,
        },
    })
        .then((delComment) => {
            if (!delComment) {
                res.status(404).json({ error: true, msg: 'Comment not found in database' });
            } else {
                res.json({ success: true, msg: 'Comment deleted successfully' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

module.exports = router;

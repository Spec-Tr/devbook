const express = require('express');
const router = express.Router();
const { User, Post, Comment } = require('../models');

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
router.get('/find/:id', (req, res) => {
    Comment.findByPk(req.params.id, {
        include: [User, Post]
    })
        .then((dbComment) => {
            if (!dbComment) {
                res.status(404).json({ error: true, msg: 'Comment not found in the database' });
            } else {
                res.json(dbComment);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// New comment
router.post('/create/:postId', (req, res) => {
    Comment.create({
        content: req.body.content,
        UserId: req.session.user.id,
        PostId: req.params.postId,
        author: req.session.user.username
    })
        .then(newComment => {
            res.json(newComment);
        })
        .catch(err => {
            res.status(500).json({ msg: 'Unable to post comment', err });
        });
});

// Update Comment 
router.put('/edit/:id', (req, res) => {
    Comment.update(
        { content: req.body.content },
        { where: { id: req.params.id } }
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
        where: { id: req.params.id }
    })
        .then((delComment) => {
            if (!delComment) {
                res.status(404).json({ error: true, msg: 'Comment not found in the database' });
            } else {
                res.json({ success: true, msg: 'Comment deleted successfully' });
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ error: true, msg: 'Internal server error', details: err.message });
        });
});

// Show all the comments in a post
router.get('/post-comments/:id', (req, res) => {
    Comment.findAll({
        include: [User, Post],
        where: { PostId: req.params.id }
    })
        .then((dbComments) => {
            res.json(dbComments);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong :(', err });
        });
});

// Show all the comments by the logged-in user
router.get('/logged-comments', (req, res) => {
    Comment.findAll({
        include: [Post],
        where: { UserId: req.session.user.id }
    })
        .then((dbComments) => {
            res.json(dbComments);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ msg: 'Something went wrong :(', err });
        });
});

module.exports = router;

// Import models
const { User, Post, Comment } = require('../models');

// Require sequelize via config
const Sequelize = require('sequelize');
require('dotenv').config();

// Set up Sequelize connection
let sequelize;

if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL);
} else {
    sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        {
            host: 'localhost',
            dialect: 'mysql',
            port: 3306
        }
    );
}

// Encrypt seeded user passwords
const bcrypt = require('bcryptjs');

// Define user data
const userData = [
    {
        username: 'Spectr',
        password: 'password',
    },
    {
        username: 'TMan',
        password: 'password'
    },
    {
        username: 'EllenMuks',
        password: 'password'
    }
];

// Hash passwords
for (let userObj of userData) {
    userObj.password = bcrypt.hashSync(userObj.password, 6)
}

// Define post data
const postData = [
    {
        title: 'I have Been Waiting Years for This!',
        content: `FIRST! ...I've always wanted to do that!`
    },
    {
        title: 'Tech for the Masses',
        content: 'This is a great way for people to read about technology.'
    },
    {
        title: 'Tech for Me',
        content: 'Looking forward to all the different things we can learn here!'
    }
];

// Define comment data
const commentData = [
    {
        content: 'Haha, awesome!'
    },
    {
        content: 'I never thought about it like that, kudos.'
    },
    {
        content: `Isn't it kind of boring to wait around for tech news?`
    }
]

// Seeding function
const seedDatabase = async () => {
    try {
        // Sync database
        await sequelize.sync();

        // Bulk create users, posts, and comments
        const dbUsers = await User.bulkCreate(userData);
        const dbPosts = await Post.bulkCreate(postData);
        const dbComment = await Comment.bulkCreate(commentData);

        // Associate users with posts and comments
        await dbUsers[0].addPosts([1]);
        await dbUsers[1].addPosts([2]);
        await dbUsers[2].addPosts([3]);
        await dbUsers[0].addComments([1]);
        await dbUsers[1].addComments([2]);
        await dbUsers[2].addComments([3]);
        await dbPosts[0].addComments([3]);
        await dbPosts[1].addComments([2]);
        await dbPosts[2].addComments([1]);

        console.log('Database seeded successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
    }
};

// Call the seeding function
seedDatabase();

//Import models
const { User, Post, Comment } = require('../models');

//Require sequelize via config
const sequelize = require('../config/connection');

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

//Encrypt seeded user passwords
const bcrypt = require('bcryptjs');

for (let userObj of userData) {
    userObj.password = bcrypt.hashSync(userObj.password, 6)
}

const postData = [
    {
        title: 'I have Been Waiting Years for This!',
        content: `FIRST! ...I've always wantted to do that!`
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

//Seeds function
const seedDatabase = async () => {
    await sequelize.sync({ force: false });
    const dbUsers = await User.bulkCreate(userData);
    const dbPosts = await Post.bulkCreate(postData);
    const dbComment = await Comment.bulkCreate(commentData);
    // add post and comments to the accounts
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
    process.exit(0)

};

//call the function
seedDatabase();
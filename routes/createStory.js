// Getting express and setting up router
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../mongo');

// Routes

// Root path redirect
router.get('/', (req, res) => res.redirect('/createStory/new'));

// Create new story
router.get('/new', function createNewStory(request, result) {
    result.render('createStory/new');
});

// Build a story - this creates a new story in the database and starts the bulding process
router.post('/build', async function createNewStory(request, result) {
    // Get story title
    const { title } = request.body;

    // Get user unique ID
    const { appUniqueID } = request.cookies;

    // If no title or empty, redirect back
    if (title === undefined || title.length === 0)
        request.redirect('/createStory/new');

    // Create story in MongoDB
    const mongoDatabase = await connectToDatabase();
    const stories = mongoDatabase.collection('stories');
    const users = mongoDatabase.collection('users');

    // Add story to database
    const { insertedId } = await stories.insertOne({
        title,
        story: {},
    });
    console.log(
        `New story created "${title}", ${insertedId} by ${appUniqueID}`
    );

    // Assign story to user
    await users.updateOne(
        { uniqueID: Number(appUniqueID) },
        { $addToSet: { storiesID: insertedId } }
    );

    // Render story creating page
    result.render('createStory/new');
});

// Return route set
module.exports = router;

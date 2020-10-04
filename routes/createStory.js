// Getting express and setting up router
const express = require('express');
const router = express.Router();
const connectToDatabase = require('../mongo');
const ObjectID = require('mongodb').ObjectID;

// Routes

// Root path redirect
router.get('/', (req, res) => res.redirect('/createStory/new'));

// Create new story
router.get('/new', function createNewStory(request, result) {
    result.render('createStory/new');
});

// Create a story - this creates a new story in the database and redirects to the bulding process
router.post('/new', async function createNewStory(request, result) {
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

    // Once created, redirect to builder passing in the story ID
    result.redirect(`/createStory/build/${insertedId}/root`);
});

// Story building process
router.get('/build/:storyID/:currentPath', async function createNewStory(
    request,
    result
) {
    // Get story details
    const { storyID, currentPath } = request.params;

    /**
     * NOTE: There is protection against other user accessing and editing somebody elses stories.
     * In a real world application an authentication system would be involved.
     */

    // Let's try looking for a story with that ID
    const mongoDatabase = await connectToDatabase();
    const stories = mongoDatabase.collection('stories');

    const storyInstance = storyID
        ? await stories.findOne({ _id: ObjectID(storyID) })
        : false;

    // Does story exist?
    if (!story) {
        result.redirect('/createStory/new');
    }

    // Access current story path
    const pathArray = currentPath.split('.').slice(1); // We remove the first one as it's the root access
    var currentObject = storyInstance.story;
    do {
        let propertyForAccess = pathArray.shift();
        currentObject =
            propertyForAccess !== undefined
                ? currentObject[propertyForAccess]
                : currentObject;
    } while (pathArray.length);

    // Once created, redirect to builder passing in the story ID
    result.render('createStory/build', { storyID, currentPath });
});

// Return route set
module.exports = router;

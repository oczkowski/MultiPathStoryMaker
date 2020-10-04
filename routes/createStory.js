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
        result.redirect('/createStory/new');

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
router.get('/build/:storyID/:currentPath', async function buildStory(
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
    if (!storyInstance) {
        result.redirect('/createStory/new');
    }

    // Access current story path
    const pathArray = currentPath.split('.').slice(1); // We remove the first one as it's the root access
    var currentObject = storyInstance;
    do {
        let propertyForAccess = pathArray.shift(); // For the purpose of this application this value will be 0, 1, 2 or 3.

        // We hit last object access, let's get what we need
        if (propertyForAccess !== undefined) {
            currentObject = currentObject.story[propertyForAccess];
        }
    } while (pathArray.length);

    var currentStory = currentObject.story;
    var currentTitle = currentObject.title;

    // Once created, redirect to builder passing in the story ID
    result.render('createStory/build', {
        storyID,
        currentPath,
        pathArray: currentPath.split('.').slice(1),
        currentTitle,
        currentStory,
    });
});

// Save new story property
router.post('/build/:storyID/:currentPath', async function buildStory(
    request,
    result
) {
    // Get story details
    const { storyID, currentPath } = request.params;

    // Get story content to save
    const { story0, story1, story2, story3 } = request.body;

    // What story index are we inserting on?
    var storyIndex;
    if (story0) storyIndex = 0;
    else if (story1) storyIndex = 1;
    else if (story2) storyIndex = 2;
    else if (story3) storyIndex = 3;

    // We need at least one story passed in order to save, if none exist let's redirect
    if (!story0 && !story1 && !story2 && !story3)
        result.redirect(`/build/${storyID}/${currentPath}`);

    // Let's try looking for a story with that ID
    const mongoDatabase = await connectToDatabase();
    const stories = mongoDatabase.collection('stories');

    const storyInstance = storyID
        ? await stories.findOne({ _id: ObjectID(storyID) })
        : false;

    // Does story exist?
    if (!storyInstance) {
        result.redirect('/createStory/new');
    }

    // Add new story to object
    const pathArray = currentPath.split('.').slice(1); // We remove the first one as it's the root access
    var currentObject = storyInstance;
    do {
        let propertyForAccess = pathArray.shift(); // For the purpose of this application this value will be 0, 1, 2 or 3.

        // We hit last object access, Let's update the story
        if (propertyForAccess !== undefined) {
            currentObject = currentObject.story[propertyForAccess];
        }
    } while (pathArray.length);

    // Once we get to the correct deph of the object, we update it
    currentObject.story = {
        ...currentObject.story,
        [storyIndex]: {
            title: story0 || story1 || story2 || story3,
            story: {},
        },
    };

    // Update mongo with new object
    await stories.updateOne(
        { _id: ObjectID(storyID) },
        { $set: { story: storyInstance.story } }
    );

    // Redirect back to building
    result.redirect(`/createStory/build/${storyID}/${currentPath}`);
});

// Return route set
module.exports = router;

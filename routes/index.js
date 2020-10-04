const connectToDatabase = require('../mongo');

// Home route
async function homeRoute(request, response) {
    /**
     * Here, we are displaying a list of already existing stories.
     * Stories are stored per browser/cookie ID. This ID is randomly generated on each new user visit.
     * From this page we're also able to create new stories/enter creation mode.
     */
    // Get user unique ID from cookie
    const { appUniqueID } = request.cookies;

    // Find user
    const mongoDatabase = await connectToDatabase();
    const users = mongoDatabase.collection('users');
    const user = await users.findOne({ uniqueID: Number(appUniqueID) });

    // Get user stories
    const stories = mongoDatabase.collection('stories');
    const userStories = await stories
        .find({ _id: { $in: user.storiesID } })
        .toArray();

    // Pull user stories to display as a list
    response.render('home', {
        stories: userStories.map(({ title, _id }) => ({
            title,
            objectID: _id,
        })),
    });
}

module.exports = homeRoute;

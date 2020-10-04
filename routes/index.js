// Home route
function homeRoute(request, response) {
    /**
     * Here, we are displaying a list of already existing stories.
     * Stories are stored per browser/cookie ID. This ID is randomly generated on each new user visit.
     * From this page we're also able to create new stories/enter creation mode.
     */
    // Get user unique ID from cookie
    const { appUniqueID } = request.cookies;

    // Pull user stories to display as a list
    response.render('home', {
        stories: [
            {
                title: 'Test story',
                objectID: 'mongoDBID',
            },
        ],
    });
}

module.exports = homeRoute;

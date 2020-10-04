// Libraries
const moment = require('moment');

// Imports
const express = require('express');
const app = express();
var cookieParser = require('cookie-parser');

// Importing routes
const home = require('./routes/index');
const viewStory = require('./routes/viewStory');
const createStory = require('./routes/createStory');

// Application settings
const appPort = 3020; // We're using port 3000 as it's the most common and it's out of root restricted range <1024
const appHost = '0.0.0.0'; // Host on all available interfaces

// Useful vars
const dnt = moment().format('HH:mm D MMM');

// Middleware
app.use(cookieParser()); // Add a cookie parser
app.use((request, result, next) => {
    // Create an unique identification cookie
    const { appUniqueID } = request.cookies;
    // Cookie doesn't exist, generate
    if (appUniqueID === undefined) {
        const uniqueID = Number(
            `${(+new Date()).toString().slice(5)}${(Math.random() * 10000) | 0}`
        ); // For the purpose of this application I will keep this simple, on a live application I'd authenticate the user.
        // Set cookie
        reesult.cookie('appUniqueID', uniqueID, {
            maxAge: 157784760000,
            httpOnly: true,
        }); // This cookie should last 5 years
        console.log(`New user joined with ID ${uniqueID}`);
    }
    // Continue
    next();
});

// Routing
app.get('/', home);
app.get('/viewStory/:id/:path', viewStory);
app.get('/createStory', createStory);

// Setup application HTTP handler
app.listen(appPort, appHost, () => {
    console.log(
        `[${dnt}] Application has started on ${appHost} using port ${appPort}.`
    );
});

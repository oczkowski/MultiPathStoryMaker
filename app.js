// Imports
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const connectToDatabase = require('./mongo');

// Libraries
const moment = require('moment');

// Home page
const home = require('./routes/index');

// Importing routes
const createStory = require('./routes/createStory');
const viewStory = require('./routes/viewStory');

// Application settings
const appPort = 3000; // We're using port 3000 as it's the most common and it's out of root restricted range <1024
const appHost = '0.0.0.0'; // Host on all available interfaces

// Useful vars
const dnt = moment().format('HH:mm D MMM');

// Our view engine will be EJS
app.set('view engine', 'ejs');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Add a cookie parser
app.use(async (request, result, next) => {
    // Create an unique identification cookie
    const { appUniqueID } = request.cookies;
    // Cookie doesn't exist, generate
    if (appUniqueID === undefined) {
        const uniqueID = Number(
            `${(+new Date()).toString().slice(5)}${(Math.random() * 10000) | 0}`
        ); // For the purpose of this application I will keep this simple, on a live application I'd authenticate the user.
        // Set cookie
        result.cookie('appUniqueID', uniqueID, {
            maxAge: 157784760000,
            httpOnly: true,
            sameSite: 'strict',
        }); // This cookie should last 5 years

        // Save to Mongo
        const mongoDatabase = await connectToDatabase();
        const users = mongoDatabase.collection('users');
        await users.insertOne({
            uniqueID: Number(uniqueID),
            storiesID: [], // Array of MongoDB entries in stories collection
        });

        // Debug
        console.log(`New user joined with ID ${uniqueID}`);
    }
    // Continue
    return next();
});

// Make public assets available for front-end users
app.use(express.static(__dirname + '/public'));

// Home route and pages
app.get('/', home);

// Routing
app.use('/createStory', createStory);
// app.get('/viewStory/:id/:path', viewStory);

// Setup application HTTP handler
app.listen(appPort, appHost, () => {
    console.log(
        `[${dnt}] Application has started on ${appHost} using port ${appPort}.`
    );
});

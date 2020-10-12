// Import mongo connect function
const { connect } = require('mongodb');

// Libraries
const moment = require('moment');

// Useful vars
const dnt = moment().format('HH:mm D MMM');

/**
 * All mongo settings are here, since it's a small application
 * there is no need for a .env file.
 */

// Settings
const HOSTNAME = process.env.MONGO_HOST || '0.0.0.0';
const PORT = process.env.MONGO_PORT || 27017;
const DATABASE_NAME = 'MultiPathStoryMaker';

// Optional Authentication
const USERNAME = '';
const PASSWORD = '';

// Create mongo connection
const authString = USERNAME && PASSWORD ? `${USERNAME}:${PASSWORD}@` : '';
const mongoURL = `mongodb://${authString}${HOSTNAME}:${PORT}`;

console.log(`Connecting to mongo using: ${mongoURL}`);

// Connect function - Returns an instance of conenction to MongoDB Database
const connectToDatabase = async () =>
    new Promise((resolve, reject) => {
        connect(mongoURL, { useUnifiedTopology: true }, function (
            error,
            client
        ) {
            // Connection error
            if (error) {
                console.log(
                    `[${dnt}] Error whilst connecting to MongoDB, ${error}`
                );
                reject(error);
            }

            // Connection successful
            console.log(
                `[${dnt}] Connected to MongoDB at ${HOSTNAME}:${PORT} successful!`
            );
            const DATABASE = client.db(DATABASE_NAME);
            resolve(DATABASE);
        });
    });

// Export function
module.exports = connectToDatabase;

// Import mongo connect function
const { connect } = require('mongodb');

/**
 * All mongo settings are here, since it's a small application
 * there is no need for a .env file.
 */

// Settings
const HOSTNAME = '0.0.0.0';
const PORT = 27017;
const DATABASE_NAME = 'MultiPathStoryMaker';

// Optional Authentication
const USERNAME = '';
const PASSWORD = '';

// Create mongo connection
const authString = USERNAME && PASSWORD ? `${USERNAME}:${PASSWORD}@` : '';
const mongoURL = `mongodb://${authString}${HOSTNAME}:${PORT}`;

// Connect function - Returns an instance of conenction to MongoDB Database
async const connectToDatabase = () => new Promise((resolve, reject) => {
    connect(mongoURL, { useUnifiedTopology: true }, function(error, client) {
        // Connection error
        if(error){
            console.log(`Error whilst connecting to MongoDB, ${err}`);
            reject(error);
        }
        
        // Connection successful
        console.log(`Connected to MongoDB at ${HOSTNAME}:${PORT} successfull!`);
        const DATABASE = client.db(DATABASE_NAME);
        resolve(DATABASE)
    })
});

// Export function
module.exports = connectToDatabase;

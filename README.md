# Multi Path Story Maker

A small test application allowing the user to create multi path stories utilising MongoDB for storage and Express for application management. This app doesn't use any front-end JavaScript and handles all the action inside of the NodeJS server.

### Requirements

-   MongoDB running instance, locally or remotely (Installation instructions found [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials))
-   Node 10 or above
-   At least one network adapter and connect Mongo to the application

### Installation instructions

1. Clone the repository or unzip the compressed file.
2. In Terminal or Console, navigate to the root directory of this project
3. Execute `npm install` and wait for all the packages to install.
4. Depending on your MongoDB installation you will either use a local IP address or a remote server address, to setup either go to mongo.js and change the details as required.
5. Create the following Database structure in mongo
   Database:
   | MultiPathStoryMaker
   --- stories
   --- users
6. Make sure your machine's port 3000 isn't occupied and run `npm start`, if for any reason that port is used please change it in app.js
7. To view and interact with the application, visit http://localhost:3000, change port if other was specified.

### Optional features

-   For easier development and running the application install `nodemon`.
-   For security between the server and MongoDB, you can setup database credentials in the `mongo.js` file.

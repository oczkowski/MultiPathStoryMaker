# Multi Path Story Maker

A small test application allowing the user to create multi path stories utilizing MongoDB for storage and Express for application management. This app doesn't use any front-end JavaScript and handles all the action inside of the NodeJS server.

Applications stack:

-   NodeJS 10+
-   ExpressJS
-   MongoDB
-   Docker

### Live Demo

Can be found here => [https://projects.oczkow.ski/multi-path-story-maker](https://projects.oczkow.ski/multi-path-story-maker)

### Requirements

-   MongoDB running instance, locally or remotely (Installation instructions found [here](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials))
-   MongoDB Client (Compass) for creating the empty tables (Installation and usage found [here](https://www.mongodb.com/try/download/compass)
-   Node 10 or above
-   At least one network adapter and connect Mongo to the application

### Installation instructions

1. Clone the repository or unzip the compressed file.
2. In Terminal or Console, navigate to the root directory of this project
3. Execute `npm install` and wait for all the packages to install.
4. Change the base path of the application under `/views/partials/header` as this is the only place it's required. Other paths are relative. Default `/multi-path-story-maker`
5. Depending on your MongoDB installation you will either use a local IP address or a remote server address, to set up either go to mongo.js and change the details as required.
6. Create the following Database structure in mongo
   Database:
   | MultiPathStoryMaker
   --- stories
   --- users
7. Make sure your machine's port 3000 isn't occupied and run `npm start`, if for any reason that port is used please change it in app.js
8. To view and interact with the application, visit http://localhost:3000, change the port if other was specified.

### Docker installation intructions

1. Clone the repository or unzip the compressed file.
2. Install [Docker](https://www.docker.com/products/docker-desktop) and [docker-compose](https://docs.docker.com/compose/install/) for chosen platform.
3. In the terminal, navigate to the root location of the project.
4. To build the image, execute `docker-compose build --no-cache` and wait for the image to build
5. Once tthe image is built, to run for development, execute `docker-compose up` and to run in de-attached mode execute `docker-compose up -d`.

### Optional features

-   For easier development and running the application install `nodemon`.
-   For security between the server and MongoDB, you can setup database credentials in the `mongo.js` file.

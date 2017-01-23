# MedStop

Simple search UI for generic name drugs given their associated brand names and vice versa.

# How to run web app

To run the website, download the repository.

The following commands can all be found in package.json. Execute them within the root of the repo.
#

To make sure all the dependencies (also listed in package.json) are installed:

npm run install
#

To create and load database:

npm run loaddb

Note 1:  You need to have MySQL installed and set up before you do this.
make sure your credentials are 'root' (user) and 'temp' (pass), or you'll have
to change some things in lib/config.js and package.json to accommodate
the credentials of your choice.

Note 2: Connections to the database are made on port 3080 (check config.js).
#

To clean and build the database models for Sequelize (located in lib/models):

npm run clean

npm run build
#

To start the server:

npm run start

Note: The server listens on port 3000 (check server.js).
#

To watch (i.e. run server and restart when changes are made to source files):

npm run watch
#

Shortcuts:

npm run all - accomplishes the clean, build, and start in one command

npm run debug - accomplishes the clean, build, and watch in one command
#

After starting up the server, go to localhost:3000 on your browser to use the web app.


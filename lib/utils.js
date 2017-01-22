/* utils.js
 * Main "library" file, contains references for other files
 * Initializes all core Node modules and functions exported for usw in other modules
 * Contains runServer, which initializes the website, and other user related functions
 */

var path            = require('path') // Core Node module for working with and handling paths
    , express       = require('express') // Express module
    , sql           = require('./sql_utils') // Sequelize
    , config        = require(path.join(__dirname, 'config')) // Hides secret configuration info
    , bodyParser    = require('body-parser') // Express middleware that adds body object to request allowing access to POST params
    , logger        = require('morgan') // Express middleware for logging requests and responses
    , session       = require('client-sessions') // Session lib by mozilla
;

/**
 * A simple authentication middleware for Express.
 *

/**
 * Create and initialize an Express application that is 'fully loaded' and ready for usage!
 *
 * This will also handle setting up all dependencies (like database connections).
 *
 * @returns {Object} - An Express App object.
 */
module.exports.runServer = function() {

    // Create Express application
    var app = express();

    // Initialize logger
    app.use(logger('dev')); // logs requests to console, dev flag includes extensive info e.g. method, status code, response time

    // Frontend settings
    app.set('view engine', 'pug'); // tells Express to use the Jade/Pug templating engine
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, "public"))); // tells app to use public directiory which stores public images, stylesheets, and scripts

    // Middleware
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

    // Locals
    app.locals.siteName = 'Hack Yale \'17';
    app.locals.pretty = true; // Send pretty code

    // Session (don't need atm)
    app.use(session({
        cookieName: 'session',
        secret: config.secret_session,
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
        httpOnly: true, // Don't ever let browser js access cookies
        secure: true, // Only use cookies over https
        ephemeral: true // Delete cookie when the browser is closed
    }));

    // Route initialization.
    app.use(require('./routes'));

    return app;
};


/*
request("https://www.reddit.com", function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);

  $('div#siteTable > div.link').each(function( index ) {
    var title = $(this).find('p.title > a.title').text().trim();
    var score = $(this).find('div.score.unvoted').text().trim();
    var user = $(this).find('a.author').text().trim();
    console.log("Title: " + title);
    console.log("Score: " + score);
    console.log("User: " + user);
    fs.appendFileSync('reddit.txt', title + '\n' + score + '\n' + user + '\n');
  });

});
*/



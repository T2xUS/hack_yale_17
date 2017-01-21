var path = require('path') // Core Node module for working with and handling paths
    , express = require('express')
    , config = require(path.join(__dirname, 'config')) // Hides secret configuration info
    , bodyParser = require('body-parser') // Express middleware that adds body object to request allowing access to POST params
    , session = require('client-sessions') // Session lib by mozilla 
    , csrf = require('csurf') // Middleware to protect against Cross-Site Request Forgery 
    , logger = require('morgan') // Express middleware for logging requests and responses
;

var middleware = require(path.join(__dirname, 'auth'));

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

    // Initalize Logger
    app.use(logger('dev')); // logs requests to console, dev flag includes extensive info e.g. method, status code, response time

    // Settings
    app.set('view engine', 'jade'); // tells Express to use the Jade templating engine
    app.set('views', path.join(__dirname, 'views'));
    app.use(express.static(path.join(__dirname, "public"))); // tells app to use public directiory which stores public images, stylesheets, and scripts

    // Middleware
    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
    app.use(session({
        cookieName: 'session',
        secret: config.secret_session,
        duration: 30 * 60 * 1000,
        activeDuration: 5 * 60 * 1000,
        httpOnly: true, // Don't ever let browser js access cookies
        secure: true, // Only use cookies over https
        ephemeral: true // Delete cookie when the browser is closed
    }));
    app.use(csrf());
    app.use(middleware.auth);

    // Locals
    app.locals.siteName = 'Hack Yale';
    app.locals.pretty = true; // Send pretty code

    /**
     * Route initialization.
     */
    // Routes
    app.use(require('./routes'));
    return app;
};

/**
 * Given a user object:
 *
 *  - Store the user object as a req.user
 *  - Make the user object available to templates as #{user}
 *  - Set a session cookie with the user object
 *
 *  @param {Object} req - The http request object.
 *  @param {Object} res - The http response object.
 *  @param {Object} user - A user object.
 */
module.exports.createUserSession = function(req, res, user) {
    var cleanUser = {
        username: user.username,
        utype: user.utype,
        firstname: user.firstname,
        lastname: user.lastname
    };
    req.session.user = cleanUser;
    //req.user = cleanUser;
    //res.locals.user = cleanUser;
};

/**
 * Ensure a user is logged in before allowing them to continue their request.
 *
 * If a user isn't logged in, they'll be redirected back to the login page.
 */
module.exports.requireLogin = function(req, res, next) {
    if (!req.user) {
        res.redirect('/login');
    } else {
        next();
    }
};

/**
 * Check if a user is already logged in, redirect to dashboard instead of home.
 */
module.exports.checkAuth = function(req, res, next) {
    if (req.session && req.session.user) {
        res.redirect('/dashboard');
    } else {
        next();
    }
};

'use strict';

/*
 * Express
 */
var express     = require('express')
    , router    = express.Router()
    , bodyParser = require('body-parser') // Express middleware that adds body object to request allowing access to POST params
    , path       = require('path'); // Core Node module for working with and handling paths

var app = express(); // Create Express application
//app.set('view engine', 'jade'); // tells Express to use the Jade templating engine
//app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended : true })); // for parsing application/x-www-form-urlencoded


/**
 * Start the web server.
 */
var port = process.env.PORT || 3000
    , expressServer = app.listen(port, function() {
        console.log('Server listening on http://localhost:%d...', expressServer.address().port);
    });
    
/*
router.all('/', function(req, res, next) {
    console.log('Someone made a request!');
    next();
});
*/

app.get('/', function(req, res) {
    console.log('?')
    res.send("SUP");
});




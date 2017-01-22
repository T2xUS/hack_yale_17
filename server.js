/* server.js
 * Run this using "npm run start"
 * For full clean, build, and run: "npm run all" or "npm run debug"
 */

'use strict';

/**
 * Start the web server.
 */
var path 			= require('path') // Core Node module for working with and handling paths
    , utils 		= require(path.join(__dirname, 'lib', 'utils')) // utils are located in lib folder
    , port 			= process.env.PORT || 3000
    , expressServer = utils.runServer().listen(port, function() {
        console.log('Server listening on http://localhost:%d...', expressServer.address().port);
    });

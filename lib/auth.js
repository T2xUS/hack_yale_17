var sql = require('./sql_utils');
var utils = require('./utils');

/**
 * A simple authentication middleware for Express.
 *
 * This middleware will load users from session data, and handle all user proxying for convenience.
 */
module.exports.auth = function(req, res, next) {
    if (req.session && req.session.user) {
        sql.models.Users
            .findOne({
                attributes: [
                    ['user', 'username'], 'utype', ['fname', 'firstname'],
                    ['lname', 'lastname']
                ],
                where: { user: req.session.user.username }
            })
            .then(function(result) {
                if (result) {
                    utils.createUserSession(req, res, result.get());
                }
                // Finished processing the middleware -> run the route
                next();
            })
            .catch(function(err) {
                console.log('Authentication Error occurred :', err);
            });
    } else {
        next();
    }
};

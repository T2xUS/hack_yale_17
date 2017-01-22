/* config.js
 * Stores database credential information
 * seq is for user access
 * auto is for generating models for Sequelize
 */

var path = require('path');
var config = {};

config.web = {};
config.web.port = process.env.WEB_PORT || 3080;

config.secret_session = 'i_am_secret';

config.seq = {
	database : 'hack_yale_17',
	username : 'root',
	password : 'temp',
	// These options are for auth.js
	options  : {
		host    : 'localhost',
		dialect : 'mysql',
		pool    : {
			max     : 50,
			min     : 0,
			idle    : 10000
		}
	}
};

config.auto = {
	database : 'hack_yale_17',
	username : 'root',
	password : 'temp',
	// These options are for gen_models.js, which uses SequelizeAuto to generate models for DB tables
	options  : {
		directory  : path.join(__dirname, 'models'), // directory to store models, ./models
		host       : 'localhost',
		dialect    : 'mysql',
		additional : {
			timestamps: false
		},
		pool       : { 
			maxConnections: 5, 
			maxIdleTime: 30
		}
	}
};

module.exports = config;
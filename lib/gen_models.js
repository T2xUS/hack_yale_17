/* gen_models.js
 * Generate models of existing tables in database for Sequelize
 * Credentials to database are located in ./config.js
 */


var SequelizeAuto = require('sequelize-auto') // MySQL Auto Model Generator
    , path = require('path') // Core Node module for working with and handling paths
    , config = require(path.join(__dirname, 'config')) // Hides secret configuration info
    , auto = new SequelizeAuto(config.auto.database, config.auto.username, config.auto.password, config.auto.options);

auto.run(function(err) {
    if (err) throw err;
    //console.log(auto.tables); // table list
    //console.log(auto.foreignKeys); // foreign key list
});

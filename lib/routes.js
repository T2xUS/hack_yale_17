'use strict';

var express     = require('express')
    , sql       = require('./sql_utils')
    , utils     = require('./utils')
    , router    = express.Router()
;

router.all('/', function(req, res, next) {
    console.log('Someone made a request!');
    next();
});

/**
 * Render the home page.
 */
router.get('/', function(req, res) {
   //res.render('home.jade');
   res.redirect('/search');
});

/** 
 * Define a route for Searching
 *
 */
router.route('/search')
	.get(function(req, res) {
        //res.render('search.jade');
        sql.query('SELECT D.dname FROM Drugs AS D', { type: sql.QueryTypes.SELECT })
            .then(function(result) {
                // result gives the result of the query
                // It is passed into Jade page as the variable 'drugs'
                //console.log(result);
                res.render('search.jade', { drugs: result });
            })
            .catch(function(err) {
                res.render('search.jade', { error: err.message });
            });
	})
	.post(function(req, res) {
		// Call function to query db
		var searchInput = {
			"gensearch" : req.body.gensearch,
            "ddsearch"  : req.body.ddsearch,
		};
        // General search
		if (searchInput.gensearch) {
            sql.query('SELECT D.dname, D.generic ' +
                'FROM Drugs AS D ' +
                'WHERE ( MATCH(D.dname) AGAINST(?)' +
                    'OR D.dname LIKE ? ' +
                    ')',
                { replacements: [
                    searchInput.gensearch,
                    '%'+searchInput.gensearch+'%',
                    ],
                type: sql.QueryTypes.SELECT })
                .then(function(result) {
                    // result gives the result of the query
                    // It is passed into Jade page as the variable 'results'
                    console.log(result);
                    console.log(result[0]);
                    res.render('results.jade', { results: result });
                })
                .catch(function(err) {
                    res.render('search.jade', { error: err.message });
                });
        // Dropdown search
	    } else if (searchInput.ddsearch) {
            sql.query('SELECT D.dname, D.generic FROM Drugs AS D WHERE D.dname = ?',
                { replacements: [searchInput.ddsearch], type: sql.QueryTypes.SELECT })
                .then(function(result) {
                    res.redirect('/search/' + result[0]['generic']);
                })
                .catch(function(err) {
                    res.render('search.jade', { error: err.message });
                });
        }
	});


// For app.use
module.exports = router;

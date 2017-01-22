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
 * Define a route for searching
 *
 */
router.route('/search')
	.get(function(req, res) {

        //res.render('search.jade');

        // This is for loading all the possible brands in the dropdown list
        sql.query('SELECT D.dname FROM Drugs AS D', { type: sql.QueryTypes.SELECT })
            .then(function(result) {
                // This is for loading all the possible generics in the dropdown list
                // Has to be within the other query because you cannot render twice
                sql.query('SELECT DISTINCT D.generic FROM Drugs AS D ORDER BY D.generic',
                    { type: sql.QueryTypes.SELECT })
                    .then(function(result2) {
                        // result gives the result of the query
                        // It is passed into Jade page as the variables 'brands' and 'generics'
                        console.log(result);
                        console.log(result2);
                        res.render('search.jade', { brands: result, generics: result2 });
                    })
                    .catch(function(err) {
                        return res.render('search.jade', { error: err.message});
                    });
            })
            .catch(function(err) {
                res.render('search.jade', { error: err.message });
            });
	})
	.post(function(req, res) {
		// Call function to query db
		var searchInput = {
			"gensearch"    : req.body.gensearch,
            "ddsearch"     : req.body.ddsearch,
            "gensearch2"   : req.body.gensearch2,
            "ddsearch2"    : req.body.ddsearch2
		};
        // Store this information in a session before redirecting
        req.session.searchInput = searchInput;
        res.redirect('/search/results');
    });


/** 
 * Define a route for results
 *
 */
 router.route('/search/results')
    .get(function(req, res) {
        var searchInput = req.session.searchInput;
        //console.log(searchInput.gensearch);
        //console.log(searchInput.ddsearch);
        //console.log(searchInput.gensearch2);
        //console.log(searchInput.ddsearch2);
        // General search for brands
		if (searchInput.gensearch) {
            sql.query('SELECT D.dname, D.generic ' +
                'FROM Drugs AS D ' +
                'WHERE ( MATCH(D.dname) AGAINST(?) ' +
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
                    //xonsole.log(result[0]);
                    res.render('results.jade', { searchType: 'brand', results: result });
                })
                .catch(function(err) {
                    res.render('search.jade', { error: err.message });
                });
        // Dropdown search for brands
	    } else if (searchInput.ddsearch) {
            sql.query('SELECT D.dname, D.generic FROM Drugs AS D WHERE D.dname = ?',
                { replacements: [searchInput.ddsearch], type: sql.QueryTypes.SELECT })
                .then(function(result) {
                    console.log(result);
                    res.redirect('/search/' + result[0]['generic']);
                })
                .catch(function(err) {
                    res.render('search.jade', { error: err.message });
                });
        // General search for generics
        } else if (searchInput.gensearch2) {
            sql.query('SELECT D.generic, D.dname ' +
                'FROM Drugs AS D ' +
                'WHERE ( MATCH(D.generic) AGAINST(?) ' +
                    'OR D.generic LIKE ? ' +
                    ')' +
                'ORDER BY D.generic',
                { replacements: [
                    searchInput.gensearch2,
                    '%'+searchInput.gensearch2+'%',
                    ],
                type: sql.QueryTypes.SELECT })
                .then(function(result) {
                    // result gives the result of the query
                    // It is passed into Jade page as the variable 'results'
                    console.log(result);
                    //console.log(result[0]);
                    res.render('results.jade', { searchType: 'generic', results: result });
                })
                .catch(function(err) {
                    res.render('search.jade', { error: err.message });
                });
        // Dropdown search for generics
        } else if (searchInput.ddsearch2) {
            sql.query('SELECT D.generic, D.dname FROM Drugs AS D WHERE D.generic = ? ORDER BY D.generic',
                { replacements: [searchInput.ddsearch2], type: sql.QueryTypes.SELECT })
                .then(function(result) {
                    console.log(result);
                    res.render('results.jade', { searchType: 'generic', results: result });
                })
                .catch(function(err) {
                    //res.render('search.jade', { error: err.message });
                });
        } 
	});



/** 
 * Define a route for info pages
 *
 */
 router.route('/search/:dname')
    .get(function(req, res) {
        //res.send(req.params);
        // Just redirect to google for now
        //res.redirect("https://www.google.com/#q=" + req.params['dname'] + "&btnI");
        // I'M FEELING LUCKY
        res.render('test.jade');
        //res.redirect("http://www.google.com/search?hl=en&q=\"" +
        //    req.params['dname'] + "\"&btnI=I%27m+Feeling+Lucky&aq=f&oq=");
    });


// For app.use
module.exports = router;

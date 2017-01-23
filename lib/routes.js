'use strict';

var express     = require('express')
    , sql       = require('./sql_utils')
    , utils     = require('./utils')
    , router    = express.Router()
    , request   = require('request') // To make a url request, for scraping
    , cheerio   = require('cheerio') // For loading data from URL, scraping
;


/* For live search
 *
 */

/*
var liveMatcher = function() {
    return function findMatches(q, cb) {

        var drugs, matches, substringRegex;

        sql.query('SELECT D.dname FROM Drugs AS D', { type: sql.QueryTypes.SELECT })
            .then(function(result) {

                // Initialize array to populate with all brand names in database
                drugs = [];

                console.log(result);
                for (var i = 0; i < result.length; ++i) {
                    drugs.push(result[i]['dname']);
                }

                // an array that will be populated with substring matches
                matches = [];

                // regex used to determine if a string contains the substring `q`
                substrRegex = new RegExp(q, 'i');

                // iterate through the pool of strings and for any string that
                // contains the substring `q`, add it to the `matches` array
                $.each(drugs, function(i, drug) {
                    if (substrRegex.test(drug)) {
                        matches.push(drug);
                    }
                });

                cb(matches);
            })
            .catch(function(err) {
                return; //res.render('search.jade', { error: err.message});
            });
    };
};


$('#livesearch .typeahead').typeahead({
    hint: true,
    highlight: true,
    minLength: 1
},
{
    name: 'drugs',
    source: liveMatcher()
});
*/


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
                    searchInput.gensearch+'%', // match words starting with this
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
                    //res.redirect('/search/' + result[0]['generic']);
                    res.render('results.jade', { searchType: 'brand', results: result });

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
                    searchInput.gensearch2+'%',  // match words starting with this
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
        //res.redirect("http://www.google.com/search?hl=en&q=\"" +
        //    req.params['dname'] + "\"&btnI=I%27m+Feeling+Lucky&aq=f&oq=");

        // To my HTML file
        //res.render('info.jade', { dname: req.params['dname'] });

        // Redirect to first Google link on search for drug
        //var url = "https://www.google.com/search?q=ibuprofen"
        var url = "https://www.google.com/search?q=" + req.params['dname'];
        console.log(url)
        request(url, function(err, resp, body) {

            if (err) {
                console.log("Error: " + err);
            }

            var $ = cheerio.load(body);

            var link = '';

            // Search for drugs.com
            $('h3.r').each(function(index) {
                console.log("HELLO");
                link = $(this).find('a').attr('href');
                // Continue if no link
                if (link == undefined) {
                    return true;
                }
                for (var i = 0; i < link.length; ++i) {
                    // 'drugs.com' is 9 characters, make sure search range doesn't exceed bounds
                    // If it does, go onto next url
                    if (i+9 > link.length) {
                        return true;
                    }
                    // Look for the substring 'drugs.com', break if found
                    if (!link.substring(i, i+9).localeCompare('drugs.com')) {
                        console.log("FOUND DRUGS")
                        return false;
                    }
                }
            });

            // Gets the first result if no matches to drugs.com
            if (link == undefined || link == '') {
                console.log("DIDN'T FIND DRUGS");
                link = $('h3.r').first().find('a').attr('href');
            }
            console.log(link);
            
            // Extract the part we need
            // Ignore "/url?q=" and go up to "&"
            var start = 7;
            var end = 0;
            for (var i = 0; i < link.length; ++i) {
                if (link[i] == '\&') {
                    break;
                }
                end++;
            }
            link = link.substring(start,end);
            //console.log(link);

            // EZ redirect
            //res.redirect(link);

            // OR SCRAPE and put on my jade file
            request(link, function(err, resp, body) {
                if (err) {
                    console.log("Error: " + err);
                }
                var $ = cheerio.load(body);
                var dname = '';
                var names = '';
                var sideeffects = '';
                var pregnancy =  '';
                var webpage = 'info.jade';
                // Get desired info
                $('div.content').each(function(index) {
                    console.log("HELLO");
                    dname = $(this).find('h1').text().trim();
                    if (!dname.localeCompare('Flecainide')) {
                        webpage = 'info-mock.jade';
                        return false;
                    }
                    names = $(this).find('p.drug-subtitle').text().trim();
                    // ignore /cdi, /pro
                    if (!link.substring(21,26).localeCompare('/cdi/')
                        || !link.substring(21,26).localeCompare('/pro/')) {
                        sideeffects = link.substring(0,21) + '/sfx/' +
                            link.substring(26,link.length-5) + '-side-effects' +
                            link.substring(link.length-5, link.length);
                        pregnancy = link.substring(0,21) + '/pregnancy/' +
                            link.substring(26,link.length);
                    } else {
                        sideeffects = link.substring(0,21) + '/sfx/' +
                            link.substring(22,link.length-5) + '-side-effects' +
                            link.substring(link.length-5, link.length);
                        pregnancy = link.substring(0,21) + '/pregnancy/' +
                            link.substring(22,link.length);
                    }
                    //console.log(pregnancy)
                 });
                res.render(webpage, { dname: dname, names: names,
                    pregnancy: pregnancy, sideeffects: sideeffects, link: link });
            });
        });

    });


// For app.use
module.exports = router;

#!/usr/bin/env node

// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/
// https://github.com/substack/stream-handbook

(function() {
	'use strict';

	// node built-ins
	var fs = require('fs'), // http://nodejs.org/api/fs.html
			zlib = require('zlib'), // http://nodejs.org/api/zlib.html
			gunzip = zlib.createGunzip(),
			source = fs.createReadStream(process.argv[2]); // first argument

	// custom stream handlers
	var liner = require('./lib/liner'), // read input linewise as stream
	    database = require('./lib/database'), // db queries
	    inserter = require('./lib/inserter'), // parse line and insert into db
	    cat = require('./lib/cat'); // do nothing

	// gunzip if neccessary
	if (!source.path.match('\\.gz$')) gunzip = cat;

	database.trip.table().then(function(data) {
		database.tables().then(function(data) {
			source
				.pipe(gunzip)
				.pipe(liner)
				.pipe(inserter(data));
		});
	});

}());

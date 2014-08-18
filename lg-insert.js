#!/usr/bin/env node

// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function() {
	'use strict';

	// node built-ins
	var fs = require('fs'), // http://nodejs.org/api/fs.html
			zlib = require('zlib'), // http://nodejs.org/api/zlib.html
			gunzip = zlib.createGunzip(),
			source = fs.createReadStream(process.argv[2]); // first argument

	// custom stream handlers
	var liner = require('./lib/liner'), // read input linewise as stream
	    converter = require('./lib/converter'), // convert ssf to jsf
	    validator = require('./lib/validator'), // validate data
	    inserter = require('./lib/inserter'), // insert data into database
	    cat = require('./lib/cat'), // insert data into database
	    stdout = require('./lib/stdout'); // print data to stdout

	// gunzip if neccessary
	if (!source.path.match('\\.gz$')) gunzip = cat;

	// convert from ssf (old file format) to jsf if neccessary
	if (false) converter = cat;

	source
		.pipe(gunzip)
		.pipe(liner)
		.pipe(converter)
		// .pipe(validator)
		.pipe(inserter)
		.pipe(stdout);

}());

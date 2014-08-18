// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
	'use strict';

	var stream = require('stream'),
	    inserter = new stream.Transform({objectMode: true});

	var pg = require('pg.js'), // https://github.com/brianc/node-postgres
	    copyFrom = require('pg-copy-streams').from, // https://github.com/brianc/node-postgres
			client = new pg.Client(conString);

	var conString = require('../config').db.conString;

	// pg.connect(function(err, client, done) {
	// 	var dbStream = client.query(copyFrom('CREATE SCHEMA IF NOT EXISTS tableName; COPY tableName FROM STDIN'));
	//   source.pipe(dbStream);
	//   source.on('end', done);
	//   source.on('error', done);
	// });

	// client.connect(function(err) {
	//   if(err) {
	//     return console.error('could not connect to postgres', err);
	//   }

	// 	/* jshint -W084 */
	// 	while (line = source.read()) {
	// 		console.log(line);
	// 	  client.query('CREATE SCHEMA IF NOT EXISTS tableName', handleResult(err, res));
	// 	}
	// });

	// source.on('finish', function() {
	//   client.end();
	// });

	var tags = [];

	var tables = require('../config/tables.js').tables;
	var cols = require('../config/tables.js').columns;

	var _ = require('lodash');

	inserter._transform = function(chunk, encoding, done) {
		var line = chunk.toString();
		var json = JSON.parse(line);
		var abbr = json[0].toLowerCase();
		var ts = json[1];
		var user_id = json[2];
		var value = json[3];
		var table;

		try {
			table = _(tables).filter({abbr: abbr}).value()[0];
		} catch(err) {
			throw(err, "TABLE NOT FOUND: " + abbr);
		}

		// var name = table.type + '_' + table.name;
		var columns = _(table.columns).map(function(c) {return (cols[c]);}).flatten().value();

		// ["ACC", 1406544316065, "35", [-0.9672575,9.222465,2.920926]]

		console.log(columns);
		// console.log(columns);


		this.push(line);
		done();
	};

	inserter._flush = function(done) {
		done();
	};

	function handleResult(err, res) {
	  if (err) { return console.error('error running query', err); }
	  console.log(res.rows);
	}

	function createTables() {
		pg.connect(conString, function(err, client, done) {
		  if(err) {
		    return console.error('error fetching client from pool', err);
		  }
		  client.query('SELECT $1::int AS number', ['1'], function(err, result) {
		    //call `done()` to release the client back to the pool
		    done();

		    if(err) {
		      return console.error('error running query', err);
		    }
		    console.log(result.rows[0].number);
		    //output: 1
		  });
		});

	}

	module.exports = inserter;
}());

// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
	'use strict';

	var stream = require('stream'),
	    inserter = new stream.Transform({objectMode: true});

	var pg = require('pg.js'), // https://github.com/brianc/node-postgres
	    copyFrom = require('pg-copy-streams').from, // https://github.com/brianc/node-postgres
			client = new pg.Client(conString);

	var conString = require('../config').db.conString;
	var chalk = require('chalk');

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

	var stats = [];
	var tags = [];

	var sensors = require('../config/tables.js').sensors;

	var _ = require('lodash');

	inserter._transform = function(chunk, encoding, done) {
		var line = chunk.toString();
		var json = JSON.parse(line);
		var abbr = json[0];
		var ts = json[1];
		var user_id = json[2];
		var values = json[3];
		var name = sensors[abbr].name;
		var tableName = 'sensor_' + name;
		var columns = sensors[abbr].columns;
		var known = tags.indexOf(abbr) < 0 ? false : true;

		if (abbr == 'TAG' && values[0].match(/START_RECORDING/)) {
		} else
		if (abbr == 'TAG' && values[0].match(/STOP_RECORDING/)) {
			// ...
		} else {
		}

		// VALIDATE DATE CORRECTNESS
		// ...

		// VALIDATE LENGTH CORRECTNESS

		if (abbr !== 'GPS') {
			if (values.length !== columns.length) {
				console.log(columns.length + " !== " + values.length );
				console.log(line);
				throw('MISMATCH!');
			}
		} else {
			if (values.length < 2 || values.length > 3)
				throw('MISMATCH! (GPS)');
		}

		// VALIDATE TYPE CORRECTNESS

		if (abbr !== 'GPS') {
			var a = _.map(columns, function(column, i) {
				switch (column.dataType) {
					case 'float':   return typeof values[i] == 'number';
					case 'text':    return typeof values[i] == 'string';
					case 'boolean': return typeof values[i] == 'boolean';
				}
			});

			if (!_.all(a)) {
				console.log(line);
				throw("TYPE MISMATCH");
			}
		}

		// console.log(_.map(values, function(value) { return typeof value; }));
		// console.log(_.map(columns, function(column) { return column.dataType; }));

		this.push(line);
		done();
	};

	inserter._flush = function(done) {
		console.log('\n\stats: ' + JSON.stringify(stats, undefined, 2));
		console.log('done');
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

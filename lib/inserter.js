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


	inserter._transform = function(chunk, encoding, done) {
		var data = chunk.toString();
		if (this._lastLineData) data = this._lastLineData + data;

		var lines = data.split('\n');
		this._lastLineData = lines.splice(lines.length - 1, 1)[0];

		lines.forEach(this.push.bind(this));
		done();
	};

	inserter._flush = function(done) {
		if (this._lastLineData) this.push(this._lastLineData);
		this._lastLineData = null;
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

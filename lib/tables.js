// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
	'use strict';

	var stream = require('stream'),
	    converter = new stream.Transform({objectMode: true}),
			_ = require('lodash'),
			pg = require('pg.js'),
			Promise = require('bluebird'),
			sql = require('sql'),
			n = 0,
			tables = [],
			query = require('./database').query;

	// happens before first input
	converter.on('pipe', function(d) {
		console.log('PIPE', n, tables);
	});

	// happens on every chunk
	converter.on('data', function(d) {
		n += 1;
		console.log('DATA', n, tables);
	});

	// happens after last input
	converter.on('end', function(d) {
		console.log('END', n, tables);
	});


	// LOWERCASE TAG PLEASE
	// NO NESTED ARRAYS PLEASE
	// NO NEWLINES IN JSON OBJECTS PLEASE
	// I CAN HAZ CHEESEBURGER PLEASE

	// step 1: test if theres a table with the name of the tag field and
	// create it with the appropiate columns if neccessary.

	// caveat 1: currently we're not testing if existing tables match the table
	// we would create (if it wouldn't exist already)


	converter._transform = function(chunk, encoding, done) {
		var line = JSON.parse(chunk),
				tag = line[0].toLowerCase(),
				timeStamp = line[1],
				userId = line[2],
				value = line[3];

		var t = {
			name: tag.toLowerCase(),
			columns: [
				{name: 'trip_id', dataType: 'int'},
				{name: 'ts',      dataType: 'bigint'},
				{name: 'user_id', dataType: 'text'},
			]
		};

		switch (Object.prototype.toString.call(value)) {
			case '[object Array]':
			_.map(value, function(val, i) {
				var type = (function() {
					switch (Object.prototype.toString.call(val)) {
						case '[object String]': return 'text';
						case '[object Number]': return 'float';
						case '[object Boolean]': return 'boolean';
				}})();
				var key = 'value' + i.toString();
				t.columns.push({name: key, dataType: type});
			});
			break;
			case '[object Object]':
			t.columns.push({name: 'value', dataType: 'json'});
			break;
			case '[object String]':
			t.columns.push({name: 'value', dataType: 'text'});
			break;
			case '[object Boolean]':
			t.columns.push({name: 'value', dataType: 'boolean'});
			break;
			case '[object Number]':
			t.columns.push({name: 'value', dataType: 'float'});
			break;
		}

		var table = sql.define(t);

		(function() {
			return new Promise(function(resolve, reject) {
				if (tables.indexOf(tag) < 0) {
					tables.push(tag);
					resolve(query(table.create().ifNotExists().toQuery()));
				} else {
					resolve();
				}
			});
		})().then(function(d) {
			this.push(JSON.stringify(line));
			done();
		}.bind(this));
	};

	converter._flush = function(done) {
		done();
	};

	var main = function(data) {
		tables = data;
		return converter;
	};

	module.exports = main;
}());

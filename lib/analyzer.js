// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
	'use strict';

	var stream = require('stream'),
	    converter = new stream.Transform({objectMode: true}),
			sensors = require('../config/tables').sensors,
			_ = require('lodash'),
			pg = require('pg.js'),
			Promise = require('bluebird'),
			sql = require('sql'),
			n = 0,
			// tables = [],
			database = require('./database'),
			query = require('./database').query;

	// happens before first input
	converter.on('pipe', function(d) {
		// console.log('PIPE', n, tables);
	});

	// happens on every chunk
	converter.on('data', function(d) {
		n += 1;
		// console.log('DATA', n, tables);
	});

	// happens after last input
	converter.on('end', function(d) {
		// console.log('END', n, tables);
	});

	var createdTables = [];

	converter._transform = function(chunk, encoding, done) {
		var line = JSON.parse(chunk),
				tag = line[0].toLowerCase(),
				timeStamp = line[1],
				userId = line[2],
				value = line[3];

		if (_.contains(tables, tag)) {
			// console.log('--- TABLE EXISTS ---');
		} else {
			// console.log('--- TABLE DOES NOT EXIST ---');
		}

		var t = {
			name: tag.toLowerCase(),
			columns: [
				{name: 'trip_id', dataType: 'int'},
				{name: 'ts',      dataType: 'bigint'},
				{name: 'user_id', dataType: 'text'},
			],
			values: {
				user_id: userId,
				ts: timeStamp,
			}
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
				t.values[key] = val;
			});
			break;
			case '[object Object]':
			t.columns.push({name: 'value', dataType: 'json'});
			t.values.value = value;
			break;
			case '[object String]':
			t.columns.push({name: 'value', dataType: 'text'});
			t.values.value = value;
			break;
			case '[object Boolean]':
			t.columns.push({name: 'value', dataType: 'boolean'});
			t.values.value = value;
			break;
			case '[object Number]':
			t.columns.push({name: 'value', dataType: 'float'});
			t.values.value = value;
			break;
		}

		var table = sql.define(t);

		var createTable = table.create().ifNotExists().toQuery();
		if (createdTables.indexOf(tag) >= 0) {
			query(createTable).then(function(response) {
				createdTables.push(tag);
				var insertData = table.insert(t.values).toQuery();
				query(insertData);
			});
		} else {

		}



		// LOWERCASE TAG PLEASE
		// NO NESTED ARRAYS PLEASE
		// NO NEWLINES INS JSON OBJECTS PLEASE
		// I CAN HAZ CHEESEBURGER PLEASE

		// step 1: test if theres a table with the name of the tag field and
		// create it with the appropiate columns if neccessary.

		this.push(JSON.stringify(line));
		done();
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

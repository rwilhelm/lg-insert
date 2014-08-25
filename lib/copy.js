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
	// converter.on('pipe', function(d) {
	// 	console.log('PIPE', n);
	// });

	// happens on every chunk
	converter.on('data', function(d) {
		n += 1;
		console.log('DATA COPY', n);
	});

	// // happens after last input
	// converter.on('end', function(d) {
	// 	console.log('END', n);
	// });


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
			values: {
				user_id: userId,
				ts: timeStamp,
			}
		};

		switch (Object.prototype.toString.call(value)) {
			case '[object Array]':
			_.map(value, function(val, i) {
				var key = 'value' + i.toString();
				t.values[key] = val;
			});
			break;
			default:
				t.values.value = value;
		}

		// console.log(t);

		// var table = sql.define(t);
		// console.log(table.insert(t.values).toQuery());
		// query(table.insert(t.values).toQuery());

		// query('INSERT INTO $1 VALUES () ')

		this.push(chunk);
		done();

		// (function() {
		// 	return new Promise(function(resolve, reject) {
		// 		resolve(query(table.insert({t.values}).toQuery()));
		// 	});
		// })().then(function(d) {
		// 	this.push(JSON.stringify(line));
		// 	done();
		// }.bind(this));
	};

	converter._flush = function(done) {
		done();
	};

	// var main = function() {
	// 	return converter;
	// };

	module.exports = converter;
}());

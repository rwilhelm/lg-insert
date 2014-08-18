// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
	'use strict';

	var stream = require('stream'),
	    converter = new stream.Transform({objectMode: true}),
			sensors = require('../config/tables').sensors,
			_ = require('lodash');

	converter._transform = function(chunk, encoding, done) {
		var line = chunk.split(',');

		// repair split embedded json value
		if (line.length > 4) {
			line = _.first(line, 3).concat(JSON.parse(_.last(line, line.length - 3)));
			line[3] = [line[3]]; // make sure it's an array
		}

		// remove additional quoting from timestamp and user_id field
		line[1] = JSON.parse(line[1]);
		line[2] = JSON.parse(line[2]);

		// description of column names and value types
		var columns = sensors[line[0]].columns;

		// if all values should be floats ...
		var allFloat = _(columns)
			.map(function(d){ return d.dataType; })
			.all(function(d){ return d == 'float'; });

		// ... split them into an array and cast them to numbers (for gps value, too)
		if (allFloat || line[0].match(/GPS/)) {
			line[3] = line[3].split(' ')
				.map(function(d){ return +d; });
		}

		// if all values should be strings ...
		var allString = _(columns)
			.map(function(d){ return d.dataType; })
			.all(function(d){ return d == 'text'; });

		// ... remove additional quoting (except for embedded json)
		if (allString && !line[3][0].match(/transportation_mean/)) {
			line[3] = [JSON.parse(line[3])]; // make sure it's an array
		}

		// split proximity values into an array, remove quoting and cast the
		// second value to boolean
		if (line[0].match(/PRX/)) {
			line[3] = line[3].split('/');
			line[3] = line[3].map(function(d){ return JSON.parse(d); });
			line[3][1] = line[3][1] == 'true' ? true : false;
		}

		this.push(JSON.stringify(line));
		done();
	};

	converter._flush = function(done) {
		done();
	};

	module.exports = converter;
}());

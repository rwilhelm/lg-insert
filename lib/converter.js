// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
	'use strict';

	var stream = require('stream'),
	    converter = new stream.Transform({objectMode: true}),
			sensors = require('../config/sensors'), // sensor/table description
			_ = require('lodash'); // https://github.com/lodash/lodash

	converter._transform = function(chunk, encoding, done) {
		var line = chunk.split(',');
		line = convertLine(line);
		this.push(line);
		done();
	};

	converter._flush = function(done) {
		done();
	};

	// converter.on('readable', function() {
	// 	console.log('READABLE');
	// });

	// converter.on('finish', function() {
	// 	console.log('FINISHED');
	// });

	// converter.on('end', function() {
	// 	console.log('ENDED');
	// });

	function convertLine(line) {
		var value;

		if (line.length > 4) {
			line = handleNestedJSON(line);
		} else {
			value = line[3].replace(/"/g, '');
		}

		var sensor = line[0];
		value = handleSensorType(sensor, value);

		// HACK: as each line is supposed to be valid json, the first field
		// containing the sensor abbreviation must be quoted [REMOVE WHEN FIXED]
		sensor = '"' + sensor + '"';

		var ts = line[1];
		var userId = line[2];

		var j = '[' + [sensor, ts, userId, JSON.stringify(value)].join(', ') + ']';

		// VALIDATIONS

		if (!JSON.parse(j)) {
			throw 'INVALID JSON';
		}

		if (new Date(ts).getTime() <= 0) {
			throw 'INVALID TIMESTAMP';
		}

		return j;
	}

	function handleNestedJSON(line) {
		// all but the first 3 fields belong to the value field
		var value = _.last(line, line.length - 3)
			.join()
			.replace(/^"|"$/g, '')
			.replace(/\\"/g, '"')
			.replace(/\\n}$/, '}');

		// validate manipulated json value
		try {
			value = JSON.parse(value);
		} catch(err) {
			throw("FAILED PARSING ENCAPSULATED JSON", err);
		}

		// put json value back in line where it belongs
		line = _.first(line, 3).concat(value);
		return line;
	}

	function handleSensorType(sensor, value) {
		var sensorType = sensors[sensor].type;

		switch(sensorType) {
			case 'xyz':
			case 'gps':
				// [2.04 6.61 -8.80] -> [2.04, 6.61, -8.80]
				value = _.flatten(value.split(' '));
				value = _(value).map(parseFloat).value();
				break;

			case 'proximity':
				// ["platform"/false/""] -> ["platform", false, ""]
				value = value.split('/');
				break;
		}

		value = _.flatten([value]);
		return value;

	}

	module.exports = converter;
}());

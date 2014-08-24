// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
	'use strict';

	// first line must be of type TAG with the value ["START_RECORDING"]

	// last line must be of type TAG with the value ["STOP_RECORDING"]

	// calling new Date(ts).getTime() with the timestamp must return a positive
	// number

	// first three values must be of type ['string', 'number', 'string']

	var stream = require('stream'),
	    validator = new stream.Transform({objectMode: true});

	// first three value types must match
	var baseValues = ['string','number','string'];

	// returns true if the types of the first three fields of _line_ match _baseValues_
	var verifyBaseValues = function(line) {
		return _(line).map(function(d) { return typeof d; }).first(3).isEqual(baseValues);
	};

	var handleValueType = function() {

	};

	validator._transform = function(chunk, encoding, done) {
		var data = chunk.toString();
		if (this._lastLineData) data = this._lastLineData + data;

		// validations (to be moved to validator.js)

		if(!verifyBaseValues(line)) {
			console.log('FIELD VALUE MISMATCH');
			throw(line);
		}



		var lines = data.split('\n');
		this._lastLineData = lines.splice(lines.length - 1, 1)[0];

		lines.forEach(this.push.bind(this));
		done();
	};

	validator._flush = function(done) {
		if (this._lastLineData) this.push(this._lastLineData);
		this._lastLineData = null;
		done();
	};

	module.exports = validator;
}());

// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
	'use strict';

	// VALIDATIONS

	// - first line must be of type TAG with the value ["START_RECORDING"]

	// - last line must be of type TAG with the value ["STOP_RECORDING"]

	// - calling new Date(ts).getTime() with ts being the timestamp must return a
	// - positive number

	var stream = require('stream'),
	    validator = new stream.Transform({objectMode: true});

	validator._transform = function(chunk, encoding, done) {
		var data = chunk.toString();
		if (this._lastLineData) data = this._lastLineData + data;

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

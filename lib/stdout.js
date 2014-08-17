// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
	'use strict';

	var stream = require('stream'),
	    stdout = new stream.Writable();

	stdout._write = function(chunk, encoding, done) {
		console.log(chunk.toString());
		done();
	};

	module.exports = stdout;
}());

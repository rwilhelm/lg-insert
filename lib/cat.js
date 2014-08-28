(function(){
	'use strict';

	var stream = require('stream'),
	    cat = new stream.PassThrough();

	module.exports = cat;
}());

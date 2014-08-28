(function() {
	'use strict';

		var schema = function(type, value) {
			return {
				type: type,
				value: function(value) {
					/*jslint evil: true*/
					return new Function('value', 'return ' + value)();
				}
			};
		};

		module.exports = {

			acc: {
				x: schema('float', 'value[0]'),
				y: schema('float', 'value[1]'),
				z: schema('float', 'value[2]')
			},

			mag: {
				x: schema('float', 'value[0]'),
				y: schema('float', 'value[1]'),
				z: schema('float', 'value[2]')
			},

			act: {
				tag: schema('text', 'value')
			},

			gps: {
				lat: schema('float', 'value[0]'),
				lon: schema('float', 'value[1]'),
				alt: schema('float', 'value[2]')
			},

			prx: {
				loc: schema('text', 'value[0]'),
				foo: schema('boolean', 'value[1]'),
				bar: schema('text', 'value[2]')
			},

		};
}());

(function() {
	'use strict';

		module.exports = {

			acc: {
				x: {
					type: "float",
					value: function(value) { return value[0]; }
				},
				y: {
					type: "float",
					value: function(value) { return value[1]; }
				},
				z: {
					type: "float",
					value: function(value) { return value[2]; }
				}
			},

			mag: {
				x: {
					type: "float",
					value: function(value) { return value[0]; }
				},
				y: {
					type: "float",
					value: function(value) { return value[1]; }
				},
				z: {
					type: "float",
					value: function(value) { return value[2]; }
				}
			},

			act: {
				tag: {
					type: "text",
					value: function(value) { return value; }
				}
			},

			gps: {
				lat: {
					type: "float",
					value: function(value) { return value[0]; }
				},
				lon: {
					type: "float",
					value: function(value) { return value[1]; }
				},
				alt: {
					type: "float",
					value: function(value) { return value[2]; }
				}
			},

			prx: {
				location: {
					type: "text",
					value: function(value) { return value[0]; }
				},
				whatever: {
					type: "boolean",
					value: function(value) { return value[1]; }
				},
				something: {
					type: "text",
					value: function(value) { return value[2]; }
				}
			},

		};
}());

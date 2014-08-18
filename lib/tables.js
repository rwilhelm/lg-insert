(function(){
	'use strict';

	var pg = require('pg.js');
	var sql = require('sql');

	var tables = require('../config/tables.js').tables;
	var columns = require('../config/tables.js').columns;
	var indices = require('../config/tables.js').indices;
	var views = require('../config/tables.js').views;

	var _ = require('lodash');

	function defineTable(t) {
		var table = {
    	name: t.type + '_' + t.name,
			columns: []
		};

		_.each(t.columns, function(c) {
			table.columns.push(columns[c]);
		});

		table.columns = _.flatten(table.columns);

		return sql.define(table);
	}

	function defineTables() {
		_(tables)
			.filter({type: 'sensor'})
			.each(function(table) { defineTable(table); });
	}

	

	exports.defineTable = defineTable;


}());


(function(){
	'use strict';

	var _ = require('lodash'),
			Promise = require('bluebird'),
			pg = require('pg.js');

	var query = function(queryString) {
		return new Promise(function(resolve, reject) {
			pg.connect("postgres://localhost/liveandgov_test", function(err, client, done) {
			  if(err) {
			    return console.error('error fetching client from pool', err);
			  }
			  client.query(queryString, function(err, result) {
			    done();

			    if(err) {
			      return console.error('error running query', err);
			    }
			    resolve(result);
			  });
			});
		});
	};

	var tables = function() {
		var q = "SELECT c.relname FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace WHERE c.relkind IN ('r','') AND n.nspname <> 'pg_catalog'AND n.nspname <> 'information_schema'AND n.nspname !~ '^pg_toast'AND pg_catalog.pg_get_userbyid(c.relowner) != 'postgres' AND pg_catalog.pg_table_is_visible(c.oid) ORDER BY 1";
		return new Promise(function(resolve, reject) {
			resolve(query(q));
		}).then(function(data) {
			return _.map(data.rows, 'relname');
		});
	};

	var trip = {
		table: function() {
			var q = "CREATE TABLE IF NOT EXISTS trip (trip_id SERIAL PRIMARY KEY, user_id VARCHAR(36), start_ts BIGINT, stop_ts BIGINT, name VARCHAR(255))";
			return new Promise(function(resolve, reject) {
				resolve(query(q));
			});
		},

		// create new trip
		create: function(userId, startTs) {
			var q = "INSERT INTO trip (trip_id, user_id, start_ts) VALUES (DEFAULT, '" + userId + "', " + startTs + ") RETURNING trip_id";
			return new Promise(function(resolve, reject) {
				resolve(query(q));
			});
		},

		// update stop_ts for current trip
		close: function(tripId, stopTs) {
			var q = "UPDATE trip SET stop_ts = " + stopTs + " WHERE trip_id = " + tripId;
			return new Promise(function(resolve, reject) {
				resolve(query(q));
			});
		}
	};

	var columns = function(tableName) {
		var q = "SELECT attname FROM pg_attribute WHERE attrelid = 'public.'" + tableName + "::regclass AND attnum > 0 AND NOT attisdropped ORDER BY attnum";
		return new Promise(function(resolve, reject) {
			resolve(query(q));
		});
	};

	module.exports = exports = {
		query: query,
		tables: tables,
		columns: columns,
		trip: trip
	};
}());
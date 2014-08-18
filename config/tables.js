(function(){
	'use strict';

	var tables = [

		// TRIPS

		{name: 'trip',                abbr: null,   type: null,     columns: ['trip']},

		// SENSORS

		{name: 'accelerometer',       abbr: 'acc',  type: 'sensor', columns: ['sensor',  'motion']  },
		{name: 'gravity',             abbr: 'gra',  type: 'sensor', columns: ['sensor',  'motion']  },
		{name: 'gyroscope',           abbr: 'gyr',  type: 'sensor', columns: ['sensor',  'motion']  },
		{name: 'linear_acceleration', abbr: 'lac',  type: 'sensor', columns: ['sensor',  'motion']  },
		{name: 'magnetic_field',      abbr: 'mag',  type: 'sensor', columns: ['sensor',  'motion']  },
		{name: 'rotation',            abbr: 'rot',  type: 'sensor', columns: ['sensor',  'motion']  },
		{name: 'proximity',           abbr: 'prx',  type: 'sensor', columns: ['sensor',  'motion']  },

		{name: 'gps',                 abbr: 'gps',  type: 'sensor', columns: ['sensor',  'gps']     },

		{name: 'tags',                abbr: 'tag',  type: 'sensor', columns: ['sensor',  'tag']     },
		{name: 'har',                 abbr: 'act',  type: 'sensor', columns: ['sensor',  'tag']     }, // raw data tag is "ACT" -- should be "HAR"
		{name: 'google_activity',     abbr: 'gact', type: 'sensor', columns: ['sensor',  'activity']},

		// SERVICES

		{name: 'sld',                 abbr: null,   type: 'service', columns: ['service', 'sld']     },
		{name: 'har',                 abbr: null,   type: 'service', columns: ['service', 'har']     },

		// SERVICE/SENSOR/WIERDO

		{name: 'sld_trips',           abbr: null,   type: 'service', columns: ['sensor',  'sld']     },
	];

	var columns = {

		trip: [
			{name: 'trip_id',  dataType: 'serial primary key'},
			{name: 'user_id',  dataType: 'varchar(36)'},
			{name: 'start_ts', dataType: 'bigint'},
			{name: 'stop_ts',  dataType: 'bigint'},
			{name: 'name',     dataType: 'varchar(255)'}
		],

		// SENSORS

		sensor: [
			{name: 'trip_id', dataType: 'int'},
			{name: 'ts',      dataType: 'bigint'},
		],

		motion: [
			{name: 'x', dataType: 'float'},
			{name: 'y', dataType: 'float'},
			{name: 'z', dataType: 'float'}
		],

		gps: [
			{name: 'lonlat', dataType: 'geography(Point)'},
		],

		tag: [
			{name: 'tag', dataType: 'text'},
		],

		activity: [
			{name: 'activity', dataType: 'text'},
		],

		// SERVICES

		service: [
			{name: 'user_id', dataType: 'varchar(36)'},
			{name: 'ts',      dataType: 'bigint'},
		],

		sld: [
			{name: 'gtfs_route_id', dataType: 'text'},
			{name: 'gtfs_shape_id', dataType: 'text'},
			{name: 'transportation_mean', dataType: 'text'},
			{name: 'score', dataType: 'int'},
		],

		har: [
			{name: 'result', dataType: 'varchar(36)'},
		]
	};

	var indices = [ 'acc', 'lac', 'gra', 'gps', 'har' ];
	var views = [ 'trip', 'gps', 'har', 'tags', 'sld' ];


	exports.tables = tables;
	exports.columns = columns;
	exports.indices = indices;
	exports.views = views;
}());



///////////////
// DB Schema //
///////////////

// CREATE TABLE IF NOT EXISTS trip (trip_id SERIAL PRIMARY KEY, user_id VARCHAR(36), start_ts BIGINT, stop_ts BIGINT, name VARCHAR(255));

// CREATE TABLE IF NOT EXISTS sensor_accelerometer       (trip_id INT, ts BIGINT, x FLOAT, y FLOAT, z FLOAT);
// CREATE TABLE IF NOT EXISTS sensor_linear_acceleration (trip_id INT, ts BIGINT, x FLOAT, y FLOAT, z FLOAT);
// CREATE TABLE IF NOT EXISTS sensor_gravity             (trip_id INT, ts BIGINT, x FLOAT, y FLOAT, z FLOAT);

// CREATE TABLE IF NOT EXISTS sensor_gps             (trip_id INT, ts BIGINT, lonlat   GEOGRAPHY(Point));
// CREATE TABLE IF NOT EXISTS sensor_tags            (trip_id INT, ts BIGINT, tag      TEXT);
// CREATE TABLE IF NOT EXISTS sensor_google_activity (trip_id INT, ts BIGINT, activity TEXT);
// CREATE TABLE IF NOT EXISTS sensor_har             (trip_id INT, ts BIGINT, tag      TEXT);

// CREATE TABLE if NOT EXISTS service_sld (user_id VARCHAR(36), ts BIGINT, gtfs_route_id TEXT, gtfs_shape_id TEXT, transportation_mean TEXT, score INT);
// CREATE TABLE if NOT EXISTS service_har (user_id VARCHAR(36), ts BIGINT, result VARCHAR(36));

// CREATE TABLE if NOT EXISTS service_sld_trips (trip_id INT, ts BIGINT, gtfs_route_id TEXT, gtfs_shape_id TEXT, transportation_mean TEXT, score INT);
// See http://www.postgresql.org/docs/8.4/static/datatype-numeric.html#DATATYPE-SERIAL for the definition of the SERIAL field.

/////////////
// Indices //
/////////////

// CREATE INDEX acc_trip_idx ON sensor_accelerometer(trip_id);
// CREATE INDEX lac_trip_idx ON sensor_linear_acceleration(trip_id);
// CREATE INDEX gra_trip_idx ON sensor_gravity(trip_id);
// CREATE INDEX gps_trip_idx ON sensor_gps(trip_id);

// CREATE INDEX har_trip_idx ON har_annotation(trip_id);

///////////
// Views //
///////////

// CREATE VIEW mts_trip AS SELECT * FROM trip;
// CREATE VIEW mts_gps  AS SELECT * FROM sensor_gps;
// CREATE VIEW mts_har  AS SELECT * FROM sensor_har;
// CREATE VIEW mts_tags AS SELECT * FROM sensor_tags;
// CREATE VIEW mts_sld  AS SELECT * FROM service_sld_trips;

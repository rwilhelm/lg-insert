(function(){
	'use strict';

	// VALIDATING FUNCTIONS
	function isNumber(n) {
		return !isNaN(+n) && isFinite(n);
	}

	// a.every(function(a) { return c(a); })

	// VALIDATIONS

	var valueTypes = {
		xyz: ['number', 'number', 'number'],
		tag: ['string']
	};

	var sensors = {

		// ?
		GACT : {type : 'activity' , name : 'Google Play Services Activity' , tableName : 'sensor_gact'} , // table correct? GACT vs ACTG
		BLT : {type : 'bluetooth' , name : 'Bluetooth ' , tableName : 'sensor_bluetooth'} ,
		ERR : {type : 'error' , name : 'Error Value ' , tableName : 'sensor_error'} ,
		GSM : {type : 'gsm' , name : 'GSM Cells ' , tableName : 'sensor_gsm'} ,
		SLD : {type : 'sld' , name : 'Service Line Detection ' , tableName : 'sensor_sld'} ,
		WTN : {type : 'waiting' , name : 'Waiting At' , tableName : 'sensor_waiting'} ,
		WIFI : {type : 'wifi' , name : 'Wi-Fi Networks ' , tableName : 'sensor_wifi'} ,

		// √
		ACTG : {type : 'activity' ,  valueTypes : ['string' , 'number'] ,             name : 'Google Play Services Activity' , tableName : 'sensor_gact'} , // table correct?
		VEL  : {type : 'velocity' ,  valueTypes : ['number'] ,                        name : 'Velocity ' , tableName                     : 'sensor_velocity'} ,
		GPS  : {type : 'gps' ,       valueTypes : ['number' , 'number'] ,             name : 'GPS' , tableName                           : 'sensor_gps'} ,
		PRX  : {type : 'proximity' , valueTypes : ['string' , 'boolean' , 'string'] , name : 'Proximity' , tableName                     : 'sensor_proximity'} ,
		TAG  : {type : 'tag' ,       valueTypes : ['string'] ,                        name : 'User Defined Tags' , tableName             : 'sensor_tags'} ,
		ACT  : {type : 'activity' ,  valueTypes : ['number' , 'number' , 'number'] ,  name : 'Human Activity Recognition' , tableName    : 'sensor_har' } , // table correct?
		ACC  : {type : 'xyz' ,       valueTypes : ['number' , 'number' , 'number'] ,  name : 'Accelerometer' , tableName                 : 'sensor_accelerometer'} ,
		GRA  : {type : 'xyz' ,       valueTypes : ['number' , 'number' , 'number'] ,  name : 'Gravity' , tableName                       : 'sensor_gravity'} ,
		GYR  : {type : 'xyz' ,       valueTypes : ['number' , 'number' , 'number'] ,  name : 'Gyroscope' , tableName                     : 'sensor_gyroscope'} ,
		LAC  : {type : 'xyz' ,       valueTypes : ['number' , 'number' , 'number'] ,  name : 'Linear Acceleration' , tableName           : 'sensor_linear_acceleration'} ,
		MAG  : {type : 'xyz' ,       valueTypes : ['number' , 'number' , 'number'] ,  name : 'Magnetometer' , tableName                  : 'sensor_magnetic_field'} ,
		ROT  : {type : 'xyz' ,       valueTypes : ['number' , 'number' , 'number'] ,  name : 'Rotation ' , tableName                     : 'sensor_rotation'} ,
	};

	module.exports = sensors;
}());

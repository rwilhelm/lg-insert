// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
  'use strict';

  var stream = require('stream'),
      converter = new stream.Transform({objectMode: true}),
      _ = require('lodash'),
      pg = require('pg.js'),
      Promise = require('bluebird'),
      sql = require('sql'),
      tripId, // store trip id when START_RECORDING
      n = 0,
      tables = [],
      trip = require('./database').trip,
      query = require('./database').query;

  // happens before first input
  converter.on('pipe', function(d) {
    // console.log('PIPE', n, tables);
  });

  // happens on every chunk
  converter.on('data', function(d) {
    n += 1;
    // console.log('DATA', n, tables);
  });

  // happens after last input
  converter.on('end', function(d) {
    // console.log('END', n, tables);
  });

  // LOWERCASE TAG PLEASE
  // NO NESTED ARRAYS PLEASE
  // NO NEWLINES IN JSON OBJECTS PLEASE
  // I CAN HAZ CHEESEBURGER PLEASE

  // step 1: test if theres a table with the name of the tag field and
  // create it with the appropiate columns if neccessary.

  // caveat 1: currently we're not testing if existing tables match the table
  // we would create (if it wouldn't exist already)

  converter._transform = function(chunk, encoding, done) {
    var line      = JSON.parse(chunk),
        tag       = line[0].toLowerCase(),
        timeStamp = line[1],
        userId    = line[2],
        value     = line[3];

    var schema = function() {
      // javascript object type to postgres value type lookup table
      var objTypes = {
        '[object String]': 'text',
        '[object Number]': 'float',
        '[object Boolean]': 'boolean',
        '[object Object]': 'json'
      };

      var jsType = Object.prototype.toString.call(value),
          pgType = objTypes[jsType],
          custom = {columns:[], values:{}};

      // traverse if array
      // don't expect nested arrays
      // TODO make recursive
      if (jsType === '[object Array]') {
        _.map(value, function(value, i) {
          var jsType = Object.prototype.toString.call(value),
              pgType = objTypes[jsType];

          custom.columns.push({name: 'value' + i.toString(), dataType: pgType});
          custom.values['value' + i.toString()] = value;
        });
      } else {
        custom.columns.push({name: 'value', dataType: pgType});
        custom.values.value = value;
      }

      return {
        name: tag,
        columns: [
          {name: 'trip_id', dataType: 'int'},
          {name: 'ts',      dataType: 'bigint'},
          {name: 'user_id', dataType: 'text'}
        ].concat(custom.columns),
        values: _.merge({
          trip_id: tripId,
          user_id: userId,
          ts: timeStamp,
        }, custom.values)
      };
    };

    // create database table
    var createTable = function() {
      return new Promise(function(resolve, reject) {
        var table = schema();
        resolve(query(sql.define(table).create().ifNotExists().toQuery()));
      }.bind(this));
    }.bind(this);

    // insert data into database
    var insertData = function() {
      return new Promise(function(resolve, reject)  {
        var table = schema(),
            values = table.values;
        resolve(query(sql.define(table).insert(values).toQuery()));
      }.bind(this));
    }.bind(this);

    // finish
    var finish = function() {
      this.push(chunk);
      done();
    }.bind(this);

    switch(value) {
      case 'START_RECORDING':
        trip.create(userId, timeStamp) // insert new row in db trip table
        .then(function(d) { tripId = d.rows[0].trip_id; }) // store tripId
        .then(finish)
        .bind(this);
        break;

      case 'STOP_RECORDING':
        trip.close(tripId, timeStamp) // update stop_ts field on current trip table row
        .then(finish)
        .bind(this);
        break;

      default:
        createTable() // create table if neccessary
        .then(function(d) { insertData(); }) // insert data into table
        .then(finish)
        .bind(this);
        break;
      }
  };

  converter._flush = function(done) {
    done();
  };

  var main = function(data) {
    tables = data;
    return converter;
  };

  module.exports = main;
}());

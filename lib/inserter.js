// http://strongloop.com/strongblog/practical-examples-of-the-new-node-js-streams-api/

(function(){
  'use strict';

  var stream     = require('stream'),
      converter  = new stream.Transform({objectMode: true}),

      _          = require('lodash'),

      pg         = require('pg.js'),
      sql        = require('sql'),

      Promise    = require('bluebird'),

      trip       = require('./database').trip,
      query      = require('./database').query;

  var n = 0, // counts rows
      tables, // already known tables
      tags = [], // occurred tags
      time, // start time
      tripId; // current trip id

  // happens before first input
  converter.on('pipe', function(d) {
    time = new Date();
  });

  // happens on every chunk
  converter.on('data', function(d) {
    n += 1;
  });

  // happens after last input
  converter.on('end', function(d) {
    console.log('done:', (new Date() - time).toString() + ' ms');
    console.log(n + ' tags:', _.unique(tags));
    process.exit(); // FIXME process stalls after last line
  });

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

    tags.push(tag);

    // parse line to database schema
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

    // go on to the next line
    var finish = function() {
      this.push(chunk);
      done();
    }.bind(this);

    switch(value) {
      case 'START_RECORDING':
        trip.create(userId, timeStamp) // insert new row in db trip table
        .then(function(d) {
          tripId = d.rows[0].trip_id;
          console.log('trip id:', tripId);
        }) // store tripId
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
        .then(function(d) { insertData(); }) // insert data into table WHY DO I NEED TO WRAP THIS?
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

// exports = module.exports = {};

// exports.parse = function() {
//  var options = {};
//  return options;
// };

var app = require('../lib/inserter');

describe("Tags", function(){
  describe("#parse()", function(){
    it("should parse long formed tags", function(){
      var args = ["--depth=4", "--hello=world"];
      var results = tags.parse(args);

      expect(results).to.have.a.property("depth", 4);
      expect(results).to.have.a.property("hello", "world");
    });
  });
});

describe("inserter", function() {
  describe(".schema()", function() {
    it("parse line to database schema", function() {
      // i/o test
    });
  });
});

describe("inserter", function() {
  describe(".schema()", function() {
    describe(".jsType", function() {
      it("some regexp test?", function() {
        //Test Goes Here
      });
    });
  });
});

describe("inserter", function() {
  describe(".schema()", function() {
    describe(".pgType", function() {
      it("some regexp test?", function() {
        //Test Goes Here
      });
    });
  });
});

describe("inserter", function() {
  describe(".createTable()", function() {
    it("create database tables", function() {
      //Test Goes Here
    });
  });
});

describe("inserter", function() {
  describe(".insertData()", function() {
    it("insert data into database tables", function() {
      //Test Goes Here
    });
  });
});

describe("inserter", function() {
  describe(".finish()", function() {
    it("should continue the stream", function() {
      //Test Goes Here
    });
  });
});

describe("inserter", function() {
  describe(".main()", function() {
    it("should set table array and call the converter", function() {
      //Test Goes Here
    });
  });
});

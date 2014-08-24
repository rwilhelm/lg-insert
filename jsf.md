### Language
The key words *MUST*, *MUST NOT*, *REQUIRED*, *SHALL*, *SHALL NOT*, *SHOULD*, *SHOULD NOT*, *RECOMMENDED*, *MAY*, and *OPTIONAL* in this document are to be interpreted as described in [RFC 2119](http://tools.ietf.org/html/rfc2119).

### Goals

The JSON Sensor Format is an easy to use human readable format for storing and transmitting sensor values captured from mobile sensors.

It reuses existing standards ([JSON](http://www.json.org)) and inherits infrastructure for parsing and validation.

### Lines and termination

A JSON Sensor Format (`.jsf`) file consists of a sequence of lines.

     JSF  = * LINE
     LINE = JSON_OBJ LF

Each line consists of a string JSON_OBJ followed by a line-feed character LF = '\n'. The LF character is the standard line separator in UNIX-type operating systems like Linux or Android (c.f. [Wikipedia](http://en.wikipedia.org/wiki/Newline#Representations))

A parser *MAY* support also other locale specific line separators (e.g. "\r\n").

The string JSON_OBJ *MUST* comply to the [JSON specification](http://www.json.org) and *MUST NOT* contain any LF or CR characters. Note, that the JSON specification does not allow LF or CR characters inside string literals. Therefore, removing all LF or CR characters from a valid JSON string yields a valid JSON string that represents the equivalent JavaScript object.

### JSON Schema

The JSON_OBJ string has to follow the following [JSON Schema](http://json-schema.org/).

    {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "title": "JSF",
    "description": "JSON Sensor Format",
    "type": "object",
    "properties": {
        "type": {
            "description": "Sensor type",
            "type": "string"
        },
        "ts": {
            "description": "Unix time stamp in ms",
            "type": "long"
        },
        "userid": {
            "description": "The unique identifier for a user",
            "type": "string"
        },
        "value": {
            "description": "Sensor value as JSON object",
            "type": "object"
        }
    },
    "required": ["id", "ts", "userid", "value"]
    }

### Example

The following example shows a formally valid jsf file:

    { "type": "ACC", "ts":12412214231, "user":"qw3q)io", "value" : [1,2,3] }
    { "type": "TAG", "ts":12412214232, "user":"qw3q)io", "value" : "\nMYTAG" }
    { "type": "ACC", "ts":12412214233, "user":"qw3q)io", "value" : [2,2,3] }
    { "type": "ACC", "ts":12412214234, "user":"qw3q)io", "value" : [3,2,3] }
    { "type": "MAG", "ts":12412214235, "user":"qw3q)io", "value" : [4,2,3] }
    { "type": "ACC", "ts":12412214236, "user":"qw3q)io", "value" : [5,2,3] }
    { "type": "GYR", "ts":12412214237, "user":"qw3q)io", "value" : [6,2,3] }
    { "type": "ACC", "ts":12412214238, "user":"qw3q)io", "value" : [7,2,3] }
    { "type": "ACC", "ts":12412214239, "user":"qw3q)io", "value" : [8,2,3] }

#### Sensor type examples



### Usage Examples

Some of the examples make use of [jq](http://stedolan.github.io/jq/)

* List file contents

        cat test.jsf

* Filter TAG values

        cat test.jsf | grep "TAG"
        cat test.jsf | jq -c -a 'select(.type == "TAG")'

* Output ACC Values

       cat test.jsf | jq -c -a 'select(.type == "ACC").values'

  ...as csv:

       cat test.jsf | jq -c -a -r 'select(.type == "ACC").values | @csv'

  ...from user "A":

       cat test.jsf | jq -c -a -r 'select(.type == "ACC") | select(.user == "A").values | @csv'

# History

The JSON Sensor Format is a revised version of the [SSF format](https://github.com/Institute-Web-Science-and-Technologies/LiveGovWP1/wiki/Sensor-Stream-Format)

### Problems with SSF
* Unclear escaping and quoting rules
* Inconsistencies in handling sensor values (custom formats for new sensors)
* Validation is hard
* Corrupt line ends
* Mapping to DB Schema involved (not really the fault of the format)

### Requirements
* Human readability
  Important for debugging
* Standard Compliant
  Allows reuse parsers and validators
* Processable with standard UNIX tools (e.g. grep, awk, cat)
  In particular one sample per line
* Interleavable
  Mixing lines from different sources shall yield a valid file
* Limited verbosity
* Platform/language independence

### Advantages of JSF over SSF
* Reuse of JSON validators
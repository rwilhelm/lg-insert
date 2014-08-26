
# CSV CORRUPTION

- don't quote stuff if not neccessary!

- all csv files are invalid!
  - http://csvlint.io/about

- if we keep using csv, we should have a schema
  - http://dataprotocols.org/json-table-schema/

- read http://lkml.iu.edu/hypermail/linux/kernel/1407.3/00650.html and think about how one who deals with this so called data must feel

# GZIP CORRUPTION

```
1788 liveandgov/UploadServletRawFiles : gzip -t *gz
gzip: 35_1406543006143.csv.gz: invalid compressed data--crc error
gzip: 35_1406543006143.csv.gz: invalid compressed data--length error
gzip: 43_1390821698110.csv.gz: unexpected end of file
```

# CATCHED JSHINT ERRORS

- W084: http://jslinterrors.com/unexpected-assignment-expression

# COPY CSV TO POSTGRES

- http://www.postgresql.org/docs/9.1/static/sql-copy.html

# IF WE HAD SANE CSV DATA, WE COULD PIPE IT DIRECTLY(!) INTO POSTGRES (BUT WE DON'T)

- https://github.com/brianc/node-pg-copy-streams

# asdf

	// public | har_annotation             | table | liveandgov

	// public | sensor_accelerometer       | table | liveandgov √
	// public | sensor_gact                | table | liveandgov √
	// public | sensor_gps                 | table | liveandgov √
	// public | sensor_gravity             | table | liveandgov √
	// public | sensor_gyroscope           | table | liveandgov √
	// public | sensor_har                 | table | liveandgov √
	// public | sensor_linear_acceleration | table | liveandgov √
	// public | sensor_magnetic_field      | table | liveandgov √
	// public | sensor_proximity           | table | liveandgov √
	// public | sensor_rotation            | table | liveandgov √
	// public | sensor_tags                | table | liveandgov √
	// public | sensor_velocity            | table | liveandgov √
	// public | sensor_waiting             | table | liveandgov √
	// public | service_sld                | table | liveandgov √

	// public | trip                       | table | liveandgov

	// public | service_har                | table | postgres
	// public | spatial_ref_sys            | table | postgres
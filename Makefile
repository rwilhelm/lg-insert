
tmpdir='./playground'
database='postgres://postgres@localhost:3333/liveandgov_dev'
schema='public'
sql-file='./sql-definitions.js'

test-data:
	scp 'lg:/srv/liveandgov/UploadServletRawFiles/*(om[1,10])' ${tmpdir}

sql-definitions:
	node-sql-generate --dsn ${database} --modularize -i '  ' -s ${schema} -o ${sql-file}
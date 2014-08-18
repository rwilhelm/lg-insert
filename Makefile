
tmpdir='./_playground'
local-database='postgres://asdf@localhost/liveandgov_test'
remote-database='postgres://postgres@localhost:3333/liveandgov_dev'
schema='public'
local-sql-file='./sql-definitions-local.js'
remote-sql-file='./sql-definitions-remote.js'

test-data:
	scp 'lg:/srv/liveandgov/UploadServletRawFiles/*(om[1,10])' ${tmpdir}

local-sql-definitions:
	node-sql-generate --dsn ${local-database} --modularize -i '  ' -s ${schema} -o ${local-sql-file}

remote-sql-definitions:
	node-sql-generate --dsn ${remote-database} --modularize -i '  ' -s ${schema} -o ${remote-sql-file}
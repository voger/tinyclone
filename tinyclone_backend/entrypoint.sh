#!/bin/bash
# Docker entrypoint script.

# Wait until Postgres is ready
set -xe
# while ! pg_isready  -h $DB_HOST -p $DB_PORT -U $DB_USER
while ! pg_isready -U $PGUSER
do
  echo "$(date) - waiting for database to start"
  sleep 2
done

# Create, migrate, and seed database if it doesn't exist.
if [[ -z `psql -U $PGUSER -Atqc "\\list $PGDATABASE"` ]]; then
  echo "Database $PGDATABASE does not exist. Creating..."
  createdb -U $PGUSER -E UTF8 $PGDATABASE -l en_US.UTF-8 -T template0
  echo "Database $PGDATABASE created."
fi

# If migrate the database if needed
/$APP_NAME/bin/$APP_NAME eval TinyClone.Release.migrate

exec $APP_NAME/bin/$APP_NAME start

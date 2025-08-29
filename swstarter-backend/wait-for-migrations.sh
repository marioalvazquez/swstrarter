#!/bin/sh
set -e

echo "Waiting for database..."
until php artisan migrate:status >/dev/null 2>&1; do
  >&2 echo "Database not ready or migrations not applied yet..."
  sleep 2
done

>&2 echo "Migrations applied, starting queue worker..."
exec php artisan queue:work --sleep=3 --tries=3

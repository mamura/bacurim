#!/bin/sh
set -eu
test "$BACURIM_E2E" = "true"
test "$APP_ENV" = "testing"
test "$DB_HOST" = "database"
test "$DB_DATABASE" = "bacurim_test"
cd /app
tar -C /source --exclude=.git --exclude='.env*' --exclude=vendor --exclude=node_modules --exclude=storage --exclude=bootstrap/cache -cf - . | tar -xf -
mkdir -p storage/logs storage/framework/cache/data storage/framework/sessions storage/framework/views storage/framework/testing bootstrap/cache
if [ -d /source/vendor ]; then cp -a /source/vendor /app/vendor; else composer install --no-interaction --prefer-dist --no-progress --no-scripts; fi
php artisan package:discover --no-ansi
php artisan migrate --force --no-ansi
php /fixtures/fixtures.php reset
exec php artisan serve --host=0.0.0.0 --port=8000 --no-reload

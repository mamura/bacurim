ARG PHP_BASE=php:8.3-cli-bookworm
FROM ${PHP_BASE}
USER root
RUN if ! php -m | grep -q pdo_pgsql; then \
    apt-get update && apt-get install -y --no-install-recommends git unzip curl libpq-dev libicu-dev libonig-dev libzip-dev \
    && docker-php-ext-install pdo_pgsql mbstring bcmath intl zip \
    && pecl install redis-6.1.0 && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*; fi
COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer
WORKDIR /app

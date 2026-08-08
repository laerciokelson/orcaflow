FROM php:8.4-fpm-bookworm

ARG APP_GID=1000
ARG APP_UID=1000

ENV COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_HOME=/tmp/composer \
    TZ=Europe/Lisbon

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        curl \
        git \
        libicu-dev \
        libzip-dev \
        unzip \
    && docker-php-ext-install -j"$(nproc)" bcmath intl opcache pcntl pdo_mysql zip \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && groupadd --gid "${APP_GID}" app \
    && useradd --uid "${APP_UID}" --gid app --create-home --shell /bin/bash app \
    && mkdir -p /var/www/html /tmp/composer \
    && chown -R app:app /var/www/html /tmp/composer \
    && rm -rf /var/lib/apt/lists/* /tmp/pear

COPY --from=composer:2.8.10 /usr/bin/composer /usr/local/bin/composer
COPY docker/php/php.ini /usr/local/etc/php/conf.d/99-orcaflow.ini
COPY docker/php/zz-app.conf /usr/local/etc/php-fpm.d/zz-app.conf

WORKDIR /var/www/html

USER app

CMD ["php-fpm"]

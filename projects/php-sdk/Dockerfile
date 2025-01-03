FROM php:8.1-cli

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . /app

WORKDIR /app
RUN composer install --no-interaction

EXPOSE 3004

CMD ["php", "-S", "0.0.0.0:3004", "-t", "public"]

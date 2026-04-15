FROM php:8.2-cli

RUN apt-get update -y
RUN apt-get install git -y
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

COPY . /app

WORKDIR /app
RUN composer install --no-interaction

EXPOSE 3004

CMD ["php", "-S", "0.0.0.0:3004", "-t", "public"]

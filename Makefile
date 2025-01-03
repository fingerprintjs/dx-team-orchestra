start-all:
	docker-compose up --build -d
stop-all:
	docker-compose down

start-java:
	docker-compose up java-sdk --build -d

start-dotnet:
	docker-compose up dotnet-sdk --build -d

start-go:
	docker-compose up go-sdk --build -d

start-node:
	docker-compose up node-sdk --build -d

start-python:
	docker-compose up python-sdk --build -d

start-php:
	docker-compose up php-sdk --build -d

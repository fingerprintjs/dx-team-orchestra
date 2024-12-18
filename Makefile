start-all:
	docker-compose up --build -d
stop-all:
	docker-compose down
stop-dotnet:
	docker-compose down
stop-java:
	docker-compose down

start-java:
	docker-compose up java-sdk --build -d

start-dotnet:
	docker-compose up dotnet-sdk --build -d

start-all:
	docker-compose up -d
stop-all:
	docker-compose down

start-java:
	docker-compose up java-sdk -d

stop-java:
	docker-compose down

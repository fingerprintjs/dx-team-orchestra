start-all:
	docker-compose up --build -d

start-all-branch:
	JAVA_SDK_BRANCH=$(JAVA_SDK_BRANCH) \
	DOTNET_SDK_BRANCH=$(DOTNET_SDK_BRANCH) \
	GO_SDK_BRANCH=$(GO_SDK_BRANCH) \
	NODE_SDK_BRANCH=$(NODE_SDK_BRANCH) \
	PYTHON_SDK_BRANCH=$(PYTHON_SDK_BRANCH) \
	PHP_SDK_BRANCH=$(PHP_SDK_BRANCH) \
	docker-compose -f docker-compose.yml -f docker-compose.branch.yml up --build -d

start-all-same-branch:
	JAVA_SDK_BRANCH=$(SDK_BRANCH) \
	DOTNET_SDK_BRANCH=$(SDK_BRANCH) \
	GO_SDK_BRANCH=$(SDK_BRANCH) \
	NODE_SDK_BRANCH=$(SDK_BRANCH) \
	PYTHON_SDK_BRANCH=$(SDK_BRANCH) \
	PHP_SDK_BRANCH=$(SDK_BRANCH) \
	docker-compose -f docker-compose.yml -f docker-compose.branch.yml up --build -d

stop-all:
	docker-compose down

start-java:
	docker-compose up java-sdk --build -d

start-java-branch:
	JAVA_SDK_BRANCH=$(JAVA_SDK_BRANCH) docker-compose -f docker-compose.yml -f docker-compose.branch.yml up java-sdk --build -d

stop-java:
	docker-compose kill java-sdk

start-dotnet:
	docker-compose up dotnet-sdk --build -d

start-dotnet-branch:
	DOTNET_SDK_BRANCH=$(DOTNET_SDK_BRANCH) docker-compose -f docker-compose.yml -f docker-compose.branch.yml up dotnet-sdk --build -d

stop-dotnet:
	docker-compose kill dotnet-sdk

start-go:
	docker-compose up go-sdk --build -d

start-go-branch:
	GO_SDK_BRANCH=$(GO_SDK_BRANCH) docker-compose -f docker-compose.yml -f docker-compose.branch.yml up go-sdk --build -d

stop-go:
	docker-compose kill go-sdk

start-node:
	docker-compose up node-sdk --build -d

start-node-branch:
	NODE_SDK_BRANCH=$(NODE_SDK_BRANCH) docker-compose -f docker-compose.yml -f docker-compose.branch.yml up node-sdk --build -d

stop-node:
	docker-compose kill node-sdk

start-python:
	docker-compose up python-sdk --build -d

start-python-branch:
	PYTHON_SDK_BRANCH=$(PYTHON_SDK_BRANCH) docker-compose -f docker-compose.yml -f docker-compose.branch.yml up python-sdk --build -d

stop-python:
	docker-compose kill python-sdk

start-php:
	docker-compose up php-sdk --build -d

start-php-branch:
	PHP_SDK_BRANCH=$(PHP_SDK_BRANCH) docker-compose -f docker-compose.yml -f docker-compose.branch.yml up php-sdk --build -d

stop-php:
	docker-compose kill php-sdk

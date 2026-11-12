# Stage 1: Build the application
FROM gradle:8.14.7-jdk17-noble AS build

# Set the working directory for Gradle
WORKDIR /app

# Copy the Gradle build files to the container and download dependencies
COPY build.gradle.kts settings.gradle.kts ./
RUN gradle build --no-daemon

# Copy the source code into the container
COPY src /app/src

# Build the application using Gradle
RUN gradle clean build --no-daemon

# Stage 2: Run the application
FROM amazoncorretto:17-alpine AS start-webserver

# Set the working directory for the final container
WORKDIR /app

# Copy the built .jar file from the build stage
#COPY --from=build /app/build/libs/java_sdk.jar app.jar
COPY --from=build /app/build/libs/*.jar app.jar

# Expose port 8080 to the host machine
EXPOSE 8080

# Command to run the application
ENTRYPOINT ["java", "-jar", "app.jar"]

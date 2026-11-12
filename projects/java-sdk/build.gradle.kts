plugins {
	java
	id("org.springframework.boot") version "4.0.9"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "com.example"
version = "0.0.1-SNAPSHOT"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

// Override versions pinned by the Spring Boot BOM to pick up fixes Boot has not shipped.
extra["jackson-2-bom.version"] = "2.22.4" // jackson-databind critical
extra["jackson-bom.version"] = "3.1.8" // tools.jackson jackson-databind critical

repositories {
	mavenCentral()
	maven {
		url = uri("https://jitpack.io")
	}
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter")
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	// The SDK models and JacksonConfig use Jackson 2 (com.fasterxml); Boot 4 defaults to Jackson 3.
	implementation("org.springframework.boot:spring-boot-jackson2")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testRuntimeOnly("org.junit.platform:junit-platform-launcher")
	implementation("com.github.fingerprintjs:fingerprint-pro-server-api-java-sdk:v7.14.1")
	implementation("com.github.fingerprintjs:java-sdk:v8.10.0")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

springBoot {
	mainClass.set("com.example.java_sdk.JavaSdkApplication")
}

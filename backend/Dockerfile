# Java 21 + Gradle 빌드 환경
FROM gradle:8.14-jdk21 AS build

WORKDIR /app

COPY . .

RUN gradle bootJar --no-daemon

# Java 21 실행 환경
FROM eclipse-temurin:21-jre

WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

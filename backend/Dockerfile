# Build stage
FROM maven:3.8.4-eclipse-temurin-17-slim AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Ensure data folder is copied if it exists in root or parent
COPY ../src/data ./src/data
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jdk-jammy
WORKDIR /app
COPY --from=build /app/target/market-backend-0.0.1-SNAPSHOT.jar app.jar
COPY --from=build /app/src/data ./src/data
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=${PORT}"]

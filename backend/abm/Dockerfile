# Build stage
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy Maven wrapper and pom.xml first (layer caching)
COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source and build
COPY src src
RUN ./mvnw package -DskipTests -B

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

# Create non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Create uploads directory
RUN mkdir -p /app/uploads && chown -R appuser:appuser /app

# Copy the built JAR
COPY --from=build /app/target/*.jar app.jar
RUN chown appuser:appuser app.jar

USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

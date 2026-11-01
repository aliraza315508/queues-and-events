FROM eclipse-temurin:17-jre-alpine

ARG SERVICE_NAME
ARG SERVER_PORT=8080

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY ${SERVICE_NAME}/target/*.jar app.jar

RUN chown app:app app.jar

USER app

EXPOSE ${SERVER_PORT}

ENTRYPOINT ["java", "-jar", "app.jar"]
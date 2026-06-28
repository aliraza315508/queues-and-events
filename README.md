# E-commerce Queues and Events

A Maven multi-module base project for an event-driven e-commerce microservices system.

## Fixed project versions

- Java: 17
- Spring Boot: 3.5.15
- Build tool: Maven
- Packaging: executable JAR for each service
- Configuration format: `.properties`

## Current modules

```text
ecommerce-queues-events/
├── pom.xml
├── compose.yaml
├── order-service/
├── customer-service/
├── product-service/
├── inventory-service/
├── payment-service/
└── notification-service/
```

## What was added

Only the base microservice modules and required dependencies were added. Controllers, DTOs, entities, repositories, service classes, Kafka producers/consumers, RabbitMQ queues/workers, and business logic are intentionally left for manual implementation.

## Dependency choices

### order-service

- Spring Web
- Validation
- Spring Data JPA
- Spring for Apache Kafka
- PostgreSQL JDBC driver
- Flyway Core
- Flyway PostgreSQL module
- Spring Boot Actuator
- Spring Boot Test
- Spring Kafka Test
- Testcontainers for JUnit, PostgreSQL, and Kafka

### customer-service

- Spring Web
- Validation
- Spring Data JPA
- PostgreSQL JDBC driver
- Flyway Core
- Flyway PostgreSQL module
- Spring Boot Actuator
- Spring Boot Test
- Testcontainers for JUnit and PostgreSQL

### product-service

- Spring Web
- Validation
- Spring Data JPA
- PostgreSQL JDBC driver
- Flyway Core
- Flyway PostgreSQL module
- Spring Boot Actuator
- Spring Boot Test
- Testcontainers for JUnit and PostgreSQL

### inventory-service

- Spring Web
- Validation
- Spring Data JPA
- Spring for Apache Kafka
- PostgreSQL JDBC driver
- Flyway Core
- Flyway PostgreSQL module
- Spring Boot Actuator
- Spring Boot Test
- Spring Kafka Test
- Testcontainers for JUnit, PostgreSQL, and Kafka

### payment-service

- Spring Web
- Validation
- Spring Data JPA
- Spring for Apache Kafka
- PostgreSQL JDBC driver
- Flyway Core
- Flyway PostgreSQL module
- Spring Boot Actuator
- Spring Boot Test
- Spring Kafka Test
- Testcontainers for JUnit, PostgreSQL, and Kafka

### notification-service

- Spring Web
- Validation
- Spring Data JPA
- Spring for Apache Kafka
- Spring AMQP / RabbitMQ
- PostgreSQL JDBC driver
- Flyway Core
- Flyway PostgreSQL module
- Spring Boot Actuator
- Spring Boot Test
- Spring Kafka Test
- Spring Rabbit Test
- Testcontainers for JUnit, PostgreSQL, Kafka, and RabbitMQ

## Local infrastructure

`compose.yaml` includes local containers for:

- PostgreSQL database per microservice
- Kafka
- RabbitMQ with management UI

RabbitMQ management UI:

```text
http://localhost:15672
username: guest
password: guest
```

## Build

From the project root:

```bash
mvn clean verify
```

Run local dependencies:

```bash
docker compose up -d
```

Run one service:

```bash
mvn -pl order-service spring-boot:run
```

```bash
mvn -pl customer-service spring-boot:run
```

```bash
mvn -pl product-service spring-boot:run
```

```bash
mvn -pl inventory-service spring-boot:run
```

```bash
mvn -pl payment-service spring-boot:run
```

```bash
mvn -pl notification-service spring-boot:run
```

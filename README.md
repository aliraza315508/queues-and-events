# E-commerce Queues and Events

Event-driven e-commerce microservices project built with Java, Spring Boot, Kafka, RabbitMQ, PostgreSQL, Docker Compose, and GitHub Actions.

## Overview

This project demonstrates a backend e-commerce flow using independent Spring Boot microservices. Each service owns its own PostgreSQL database, communicates through REST for basic CRUD operations, and uses Kafka/RabbitMQ for asynchronous business events.

## Tech Stack

* Java 17
* Spring Boot 3.5.x
* Spring Web
* Spring Data JPA
* PostgreSQL
* Flyway
* Apache Kafka
* RabbitMQ
* Docker Compose
* GitHub Actions
* Maven multi-module build

## Services

| Service              | Port | Responsibility                                          |
| -------------------- | ---: | ------------------------------------------------------- |
| order-service        | 8081 | Creates orders and publishes order events               |
| customer-service     | 8082 | Manages customer data                                   |
| product-service      | 8083 | Manages product data                                    |
| inventory-service    | 8084 | Reserves/rejects stock from order events                |
| payment-service      | 8085 | Processes payments after inventory reservation          |
| notification-service | 8086 | Creates and sends notifications from final order events |

## Event Flow

```text
Order Created
    ↓ Kafka: order.created
Inventory Reserved / Rejected
    ↓ Kafka: inventory.reserved / inventory.rejected
Payment Completed / Failed
    ↓ Kafka: payment.completed / payment.failed
Order Confirmed / Cancelled
    ↓ Kafka: order.confirmed / order.cancelled
Notification Created
    ↓ RabbitMQ: notification.queue
Notification Sent
```

## Infrastructure

Local Docker Compose provides:

* PostgreSQL database per service
* Kafka broker
* RabbitMQ with management UI

RabbitMQ UI:

```text
http://localhost:15672
username: guest
password: guest
```

## Run Locally

Start infrastructure:

```bash
docker compose up -d
```

Run all Maven tests:

```bash
mvn clean test
```

Package all services:

```bash
mvn package -DskipTests
```

Run one service:

```bash
mvn -pl order-service spring-boot:run
```

Use the same pattern for other services:

```bash
mvn -pl customer-service spring-boot:run
mvn -pl product-service spring-boot:run
mvn -pl inventory-service spring-boot:run
mvn -pl payment-service spring-boot:run
mvn -pl notification-service spring-boot:run
```

## Main Endpoints

| Service              | Endpoint Examples                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| customer-service     | `POST /customers`, `GET /customers`, `GET /customers/{id}`                                              |
| product-service      | `POST /products`, `GET /products`, `GET /products/{id}`                                                 |
| inventory-service    | `POST /inventory`, `GET /inventory/product/{productId}`, `PATCH /inventory/product/{productId}/reserve` |
| order-service        | `POST /orders`, `GET /orders`, `GET /orders/{id}`                                                       |
| payment-service      | `GET /payments/order/{orderId}`, `PATCH /payments/order/{orderId}/complete`                             |
| notification-service | `GET /api/notifications/order/{orderId}`, `PATCH /api/notifications/{id}/sent`                          |

## CI/CD

GitHub Actions workflow:

```text
.github/workflows/local-ci-compose.yaml
```

Pipeline steps:

1. Checkout code
2. Set up Java 17
3. Run Maven tests
4. Package all services
5. Generate CI Docker Compose file
6. Build and start the full system
7. Run JavaScript smoke tests
8. Print logs on failure
9. Shut down containers

Custom local action:

```text
.github/actions/generate-ci-compose
```

Smoke test folder:

```text
scripts/smoke-test
```

## Project Structure

```text
.
├── customer-service
├── product-service
├── order-service
├── inventory-service
├── payment-service
├── notification-service
├── scripts/smoke-test
├── .github/actions/generate-ci-compose
├── .github/workflows/local-ci-compose.yaml
├── compose.yaml
├── Dockerfile
└── pom.xml
```

## Current Status

* Base REST APIs implemented
* PostgreSQL and Flyway configured per service
* Kafka event flow implemented between order, inventory, payment, and notification services
* RabbitMQ notification queue implemented in notification-service
* Docker Compose infrastructure available locally
* GitHub Actions CI pipeline added for build, compose startup, and smoke testing


## Architecture Diagram

```mermaid
flowchart TD
    Client["Client / Smoke Test / Postman"]

    subgraph RestSetup["REST Setup Endpoints"]
        CustomerAPI["customer-service :8082<br/>POST /customers"]
        ProductAPI["product-service :8083<br/>POST /products"]
        InventoryAPI["inventory-service :8084<br/>POST /inventory"]
        OrderAPI["order-service :8081<br/>POST /orders"]
    end

    subgraph Databases["Database Per Service"]
        CustomerDB[("customer_db")]
        ProductDB[("product_db")]
        InventoryDB[("inventory_db")]
        OrderDB[("order_db")]
        PaymentDB[("payment_db")]
        NotificationDB[("notification_db")]
    end

    subgraph Kafka["Apache Kafka Event Bus"]
        OrderCreated["topic: order.created"]
        InventoryReserved["topic: inventory.reserved"]
        InventoryRejected["topic: inventory.rejected"]
        PaymentCompleted["topic: payment.completed"]
        PaymentFailed["topic: payment.failed"]
        OrderConfirmed["topic: order.confirmed"]
        OrderCancelled["topic: order.cancelled"]
    end

    subgraph RabbitMQ["RabbitMQ Notification Queue"]
        NotificationExchange["exchange: notification.exchange"]
        NotificationQueue["queue: notification.queue"]
        NotificationWorker["NotificationWorker"]
    end

    Client --> CustomerAPI
    Client --> ProductAPI
    Client --> InventoryAPI
    Client --> OrderAPI

    CustomerAPI --> CustomerDB
    ProductAPI --> ProductDB
    InventoryAPI --> InventoryDB

    OrderAPI --> OrderDB
    OrderAPI -->|"publishes OrderCreatedEvent"| OrderCreated

    OrderCreated -->|"consumed by inventory-service"| InventoryAPI
    InventoryAPI -->|"reserve stock"| InventoryDB

    InventoryAPI -->|"stock available"| InventoryReserved
    InventoryAPI -->|"stock unavailable"| InventoryRejected

    InventoryReserved -->|"consumed by payment-service"| PaymentService["payment-service :8085"]
    PaymentService -->|"create and complete payment"| PaymentDB
    PaymentService -->|"payment success"| PaymentCompleted
    PaymentService -->|"payment failure"| PaymentFailed

    InventoryRejected -->|"consumed by order-service"| OrderCancelFromInventory["order-service cancels order"]
    PaymentFailed -->|"consumed by order-service"| OrderCancelFromPayment["order-service cancels order"]
    PaymentCompleted -->|"consumed by order-service"| OrderConfirm["order-service confirms order"]

    OrderConfirm --> OrderDB
    OrderConfirm -->|"publishes OrderConfirmedEvent"| OrderConfirmed

    OrderCancelFromInventory --> OrderDB
    OrderCancelFromInventory -->|"publishes OrderCancelledEvent"| OrderCancelled

    OrderCancelFromPayment --> OrderDB
    OrderCancelFromPayment -->|"publishes OrderCancelledEvent"| OrderCancelled

    OrderConfirmed -->|"consumed by notification-service"| NotificationService["notification-service :8086"]
    OrderCancelled -->|"consumed by notification-service"| NotificationService

    NotificationService -->|"create notification row"| NotificationDB
    NotificationService -->|"status: QUEUED"| NotificationDB
    NotificationService -->|"publish NotificationMessage"| NotificationExchange
    NotificationExchange -->|"routing key: notification.send"| NotificationQueue
    NotificationQueue --> NotificationWorker
    NotificationWorker -->|"logs simulated send"| NotificationWorker
    NotificationWorker -->|"status: SENT or FAILED"| NotificationDB
```

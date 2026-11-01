# E-commerce Queues and Events

Event-driven e-commerce microservices project built with Java, Spring Boot, Kafka, RabbitMQ, PostgreSQL, Docker Compose, and GitHub Actions.

## Overview

The system uses REST APIs for basic data management and asynchronous messaging for the order-processing workflow. Each microservice owns its own PostgreSQL database.

## Tech Stack

* Java 17 and Spring Boot 3.5.15
* Spring Web, Spring Data JPA, Flyway, and Actuator
* Apache Kafka and RabbitMQ
* PostgreSQL
* SMTP email with Spring Mail
* Twilio SMS
* Docker Compose and GitHub Actions
* Maven multi-module build

## Services

| Service              | Port | Responsibility                                |
| -------------------- | ---: | --------------------------------------------- |
| order-service        | 8081 | Creates orders and manages final order status |
| customer-service     | 8082 | Manages customer contact information          |
| product-service      | 8083 | Manages products                              |
| inventory-service    | 8084 | Reserves or rejects inventory                 |
| payment-service      | 8085 | Processes payments                            |
| notification-service | 8086 | Sends email and SMS notifications             |

## Kafka Pipeline

```text
POST /orders
    -> order.created
    -> inventory-service
       -> inventory.reserved -> payment-service
          -> payment.completed -> order confirmed
          -> payment.failed    -> order cancelled
       -> inventory.rejected   -> order cancelled
    -> order.confirmed or order.cancelled
    -> notification-service
```

Kafka topics:

```text
order.created
inventory.reserved
inventory.rejected
payment.completed
payment.failed
order.confirmed
order.cancelled
```

## Notification Pipeline

```text
order.confirmed / order.cancelled (Kafka)
    -> notification-service gets customer email and phone
    -> notification saved with QUEUED status
    -> notification.exchange
    -> routing key: notification.send
    -> notification.queue
    -> RabbitMQ worker
    -> SMTP email + Twilio SMS
       -> success: status updated to SENT
       -> failure: RabbitMQ retries
       -> retries exhausted: status updated to FAILED
          and message sent to notification.dlq
```

Email and SMS delivery can be enabled independently. SMS is disabled by default.

## Messaging Reliability

### Kafka Retry and Dead Letter Topics

Kafka consumers use Spring Kafka's `DefaultErrorHandler` with a fixed backoff strategy for technical processing failures.

The retry configuration uses:

```java
new FixedBackOff(1000L, 2L)
```

This provides:

* 1 initial processing attempt
* 2 retry attempts
* 1 second between attempts
* 3 total processing attempts

After retry exhaustion, the failed message is published to the appropriate Dead Letter Topic (DLT).

| Service           | Dead Letter Topic |
| ----------------- | ----------------- |
| inventory-service | `inventory.dlt`   |
| payment-service   | `payment.dlt`     |
| order-service     | `order.dlt`       |

Business failures are handled separately from technical failures.

For example, insufficient inventory is an expected business condition. Instead of retrying the message as a technical failure, inventory-service publishes an `inventory.rejected` event so the order can follow the normal cancellation workflow.

Technical failures such as database or infrastructure failures are allowed to propagate to the Kafka error handler so retry and DLT recovery can occur.

### RabbitMQ Retry and Dead Letter Queue

Notification delivery uses Spring RabbitMQ listener retries with exponential backoff.

The retry policy is:

* Maximum attempts: 3
* Initial retry interval: 1000 ms
* Backoff multiplier: 2.0
* Maximum retry interval: 5000 ms

The failure flow is:

```text
notification.queue
    -> attempt 1
    -> ~1 second
    -> attempt 2
    -> ~2 seconds
    -> attempt 3
    -> retries exhausted
    -> notification marked FAILED
    -> notification.exchange.dlq
    -> routing key: notification.failed
    -> notification.dlq
```

Delivery exceptions are rethrown by the notification worker so Spring RabbitMQ can perform the configured retries.

A notification is not marked `FAILED` after the first unsuccessful delivery attempt. The final `FAILED` state is applied only after retry exhaustion.

The dead-letter queue preserves failed notification messages for investigation or controlled replay instead of silently discarding them.

## Run Locally

Start PostgreSQL, Kafka, and RabbitMQ:

```bash
docker compose up -d
```

Run all tests:

```bash
mvn clean test
```

Run a service:

```bash
mvn -pl order-service spring-boot:run
```

Replace `order-service` with any other service module as needed.

RabbitMQ management UI:

```text
http://localhost:15672
username: guest
password: guest
```

## Email and SMS Configuration

Configure `notification-service` with environment variables. Do not commit real credentials.

```env
NOTIFICATION_EMAIL_ENABLED=true
NOTIFICATION_EMAIL_FROM=no-reply@example.com
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_SMTP_AUTH=false
MAIL_SMTP_STARTTLS_ENABLE=false

NOTIFICATION_SMS_ENABLED=false
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_PHONE_NUMBER=
```

## Main Endpoints

| Service              | Endpoint examples                                                                                            |
| -------------------- | ------------------------------------------------------------------------------------------------------------ |
| customer-service     | `POST /customers`, `GET /customers`, `GET /customers/{id}`                                                   |
| product-service      | `POST /products`, `GET /products`, `GET /products/{id}`                                                      |
| inventory-service    | `POST /inventory`, `GET /inventory/product/{productId}`, `PATCH /inventory/product/{productId}/reserve`      |
| order-service        | `POST /orders`, `GET /orders`, `GET /orders/{id}`                                                            |
| payment-service      | `GET /payments/order/{orderId}`, `PATCH /payments/order/{orderId}/complete`                                  |
| notification-service | `GET /api/notifications`, `GET /api/notifications/order/{orderId}`, `GET /api/notifications/status/{status}` |

## CI/CD

The GitHub Actions workflow at `.github/workflows/local-ci-compose.yaml`:

1. Runs Maven tests and packages all services.
2. Generates the CI Docker Compose file.
3. Builds and starts the complete system.
4. Runs JavaScript health and event-flow smoke tests.
5. Prints logs on failure and removes containers.

## Architecture Diagram

```mermaid
flowchart TD
    Client["Client / Postman / Smoke Tests"]

    subgraph Services["Spring Boot Microservices"]
        CustomerService["customer-service :8082"]
        ProductService["product-service :8083"]
        OrderService["order-service :8081"]
        InventoryService["inventory-service :8084"]
        PaymentService["payment-service :8085"]
        NotificationService["notification-service :8086"]
    end

    subgraph Databases["PostgreSQL - Database Per Service"]
        CustomerDB[("customer_db")]
        ProductDB[("product_db")]
        OrderDB[("order_db")]
        InventoryDB[("inventory_db")]
        PaymentDB[("payment_db")]
        NotificationDB[("notification_db")]
    end

    Client --> CustomerService
    Client --> ProductService
    Client --> InventoryService
    Client --> OrderService

    CustomerService --> CustomerDB
    ProductService --> ProductDB
    OrderService --> OrderDB
    InventoryService --> InventoryDB
    PaymentService --> PaymentDB
    NotificationService --> NotificationDB

    subgraph Kafka["Apache Kafka Event Pipeline"]
        OrderCreated["order.created"]
        InventoryReserved["inventory.reserved"]
        InventoryRejected["inventory.rejected"]
        PaymentCompleted["payment.completed"]
        PaymentFailed["payment.failed"]
        OrderConfirmed["order.confirmed"]
        OrderCancelled["order.cancelled"]

        InventoryDLT["inventory.dlt"]
        PaymentDLT["payment.dlt"]
        OrderDLT["order.dlt"]
    end

    OrderService -->|"Publish"| OrderCreated
    OrderCreated -->|"Consume"| InventoryService

    InventoryService -->|"Stock available"| InventoryReserved
    InventoryService -->|"Stock unavailable"| InventoryRejected
    InventoryService -->|"Technical failure after retries"| InventoryDLT

    InventoryReserved -->|"Consume"| PaymentService
    PaymentService -->|"Payment successful"| PaymentCompleted
    PaymentService -->|"Payment unsuccessful"| PaymentFailed
    PaymentService -->|"Technical failure after retries"| PaymentDLT

    InventoryRejected -->|"Cancel order"| OrderService
    PaymentFailed -->|"Cancel order"| OrderService
    PaymentCompleted -->|"Confirm order"| OrderService

    OrderService -->|"Publish"| OrderConfirmed
    OrderService -->|"Publish"| OrderCancelled
    OrderService -->|"Technical failure after retries"| OrderDLT

    OrderConfirmed -->|"Consume"| NotificationService
    OrderCancelled -->|"Consume"| NotificationService

    NotificationService -->|"Get customer contact details"| CustomerService
    NotificationService -->|"Save QUEUED notification"| NotificationDB

    subgraph RabbitMQ["RabbitMQ Notification Pipeline"]
        Exchange["notification.exchange"]
        Queue["notification.queue"]
        Worker["NotificationWorker"]
        DLX["notification.exchange.dlq"]
        DLQ["notification.dlq"]
    end

    NotificationService -->|"Publish NotificationMessage"| Exchange
    Exchange -->|"notification.send"| Queue
    Queue -->|"Consume"| Worker

    Worker -->|"Delivery failure -> retry"| Queue
    Queue -->|"Retries exhausted / notification.failed"| DLX
    DLX -->|"notification.failed"| DLQ

    subgraph Delivery["Notification Delivery"]
        EmailSender["EmailNotificationSender"]
        SmsSender["SmsNotificationSender"]
        SMTP["SMTP Email Server"]
        Twilio["Twilio SMS API"]
    end

    Worker --> EmailSender
    Worker --> SmsSender

    EmailSender -->|"Email enabled"| SMTP
    SmsSender -->|"SMS enabled"| Twilio

    Worker -->|"Success -> SENT"| NotificationDB
    Worker -->|"Retries exhausted -> FAILED"| NotificationDB
```

package com.aliraza.ecommerce.notificationservice;

import com.aliraza.ecommerce.notificationservice.message.NotificationMessage;
import com.aliraza.ecommerce.notificationservice.model.Notification;
import com.aliraza.ecommerce.notificationservice.model.NotificationStatus;
import com.aliraza.ecommerce.notificationservice.model.NotificationType;
import com.aliraza.ecommerce.notificationservice.repository.NotificationRepository;

import org.junit.jupiter.api.Test;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.Duration;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

@Testcontainers
@SpringBootTest(properties = {
        "app.notification.email.enabled=false",
        "app.notification.sms.enabled=false",
        "spring.kafka.listener.auto-startup=false"
})
class NotificationRabbitMQIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:17-alpine")
                    .withDatabaseName("notification_test")
                    .withUsername("test")
                    .withPassword("test");

    @Container
    static RabbitMQContainer rabbit =
            new RabbitMQContainer("rabbitmq:4-management-alpine");

    @DynamicPropertySource
    static void configureProperties(
            DynamicPropertyRegistry registry
    ) {

        registry.add(
                "spring.datasource.url",
                postgres::getJdbcUrl
        );

        registry.add(
                "spring.datasource.username",
                postgres::getUsername
        );

        registry.add(
                "spring.datasource.password",
                postgres::getPassword
        );

        registry.add(
                "spring.rabbitmq.host",
                rabbit::getHost
        );

        registry.add(
                "spring.rabbitmq.port",
                rabbit::getAmqpPort
        );

        registry.add(
                "spring.rabbitmq.username",
                rabbit::getAdminUsername
        );

        registry.add(
                "spring.rabbitmq.password",
                rabbit::getAdminPassword
        );
    }

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    void shouldConsumeRabbitMessageAndMarkNotificationSent() {

        UUID orderId = UUID.randomUUID();

        Notification notification =
                new Notification(
                        orderId.toString(),
                        "test-customer",
                        "test@example.com",
                        null,
                        NotificationType.ORDER_CONFIRMED,
                        "Order Confirmed",
                        "Your test order has been confirmed."
                );

        Notification saved =
                notificationRepository.saveAndFlush(notification);

        saved.markQueued();

        notificationRepository.saveAndFlush(saved);

        NotificationMessage message =
                new NotificationMessage(
                        saved.getId(),
                        orderId,
                        saved.getCustomerId(),
                        saved.getRecipientEmail(),
                        saved.getRecipientPhone(),
                        saved.getNotificationType().name(),
                        saved.getSubject(),
                        saved.getMessage()
                );

        rabbitTemplate.convertAndSend(
                "notification.exchange",
                "notification.send",
                message
        );

        await()
                .atMost(Duration.ofSeconds(10))
                .untilAsserted(() -> {

                    Notification updated =
                            notificationRepository
                                    .findById(saved.getId())
                                    .orElseThrow();

                    assertThat(updated.getStatus())
                            .isEqualTo(NotificationStatus.SENT);
                });
    }
}
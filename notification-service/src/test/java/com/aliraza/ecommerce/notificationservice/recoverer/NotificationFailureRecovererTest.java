package com.aliraza.ecommerce.notificationservice.recoverer;

import com.aliraza.ecommerce.notificationservice.service.NotificationService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.AmqpRejectAndDontRequeueException;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.support.ListenerExecutionFailedException;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class NotificationFailureRecovererTest {

    private NotificationService notificationService;
    private NotificationFailureRecoverer recoverer;

    @BeforeEach
    void setUp() {
        notificationService = mock(NotificationService.class);

        recoverer = new NotificationFailureRecoverer(
                notificationService,
                new ObjectMapper()
        );
    }

    @Test
    void retriesExhaustedMarksNotificationAsFailedAndRejectsMessage() {

        UUID notificationId = UUID.randomUUID();

        String json = """
                {
                    "notificationId": "%s"
                }
                """.formatted(notificationId);

        Message message = new Message(
                json.getBytes(StandardCharsets.UTF_8)
        );

        RuntimeException deliveryFailure =
                new RuntimeException("SMTP unavailable");

        assertThatThrownBy(
                () -> recoverer.recover(message, deliveryFailure)
        )
                .isInstanceOf(ListenerExecutionFailedException.class)
                .hasMessage("Retry Policy Exhausted");

        verify(notificationService)
                .markNotificationAsFailed(notificationId);
    }
}
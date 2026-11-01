package com.aliraza.ecommerce.notificationservice.recoverer;

import com.aliraza.ecommerce.notificationservice.service.NotificationService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.core.Message;
import org.springframework.amqp.rabbit.retry.MessageRecoverer;
import org.springframework.amqp.rabbit.retry.RejectAndDontRequeueRecoverer;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class NotificationFailureRecoverer implements MessageRecoverer {

    private static final Logger log =
            LoggerFactory.getLogger(NotificationFailureRecoverer.class);

    private final NotificationService notificationService;
    private final ObjectMapper objectMapper;

    private final RejectAndDontRequeueRecoverer rejectRecoverer =
            new RejectAndDontRequeueRecoverer();

    public NotificationFailureRecoverer(
            NotificationService notificationService,
            ObjectMapper objectMapper
    ) {
        this.notificationService = notificationService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void recover(Message message, Throwable cause) {

        UUID notificationId = null;

        try {
            JsonNode payload = objectMapper.readTree(message.getBody());

            String notificationIdValue =
                    payload.path("notificationId").asText(null);

            if (notificationIdValue == null || notificationIdValue.isBlank()) {
                throw new IllegalStateException(
                        "notificationId is missing from RabbitMQ message"
                );
            }

            notificationId = UUID.fromString(notificationIdValue);

            notificationService.markNotificationAsFailed(notificationId);

            log.error(
                    "RabbitMQ retries exhausted. notificationId={} marked FAILED and message will be dead-lettered.",
                    notificationId,
                    cause
            );

        } catch (Exception failureTrackingException) {

            log.error(
                    "RabbitMQ retries exhausted, but notification could not be marked FAILED. notificationId={}. Message will still be dead-lettered.",
                    notificationId,
                    failureTrackingException
            );
        }

        rejectRecoverer.recover(message, cause);
    }
}
package com.aliraza.ecommerce.notificationservice.worker;

import com.aliraza.ecommerce.notificationservice.message.NotificationMessage;
import com.aliraza.ecommerce.notificationservice.sender.EmailNotificationSender;
import com.aliraza.ecommerce.notificationservice.sender.SmsNotificationSender;
import com.aliraza.ecommerce.notificationservice.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

public class NotificationWorkerTest {


    private NotificationService notificationService;
    private EmailNotificationSender emailNotificationSender;
    private SmsNotificationSender smsNotificationSender;
    private NotificationWorker notificationWorker;


    @BeforeEach
    void setUp() {

        notificationService = mock(NotificationService.class) ;
        emailNotificationSender = mock(EmailNotificationSender.class) ;
        smsNotificationSender = mock(SmsNotificationSender.class) ;

        notificationWorker = new NotificationWorker(notificationService,
                emailNotificationSender,
                smsNotificationSender);


    }


    @Test
    void successfulDeliveryMarksNotificationSent() {

        UUID notificationId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();

        NotificationMessage message = new NotificationMessage(
                notificationId,
                orderId,
                "customer-123",
                "customer@example.com",
                "+15555550123",
                "ORDER_CONFIRMED",
                "Order Confirmed",
                "Your order has been confirmed."
        );

        notificationWorker.processNotification(message);

        verify(emailNotificationSender).send(message);
        verify(smsNotificationSender).send(message);
        verify(notificationService)
                .markNotificationAsSent(notificationId);

    }


    @Test
    void deliveryFailureIsRethrownForRabbitMqRetry() {

        UUID notificationId = UUID.randomUUID();
        UUID orderId = UUID.randomUUID();

        NotificationMessage message = new NotificationMessage(
                notificationId,
                orderId,
                "customer-123",
                "customer@example.com",
                "+15555550123",
                "ORDER_CONFIRMED",
                "Order Confirmed",
                "Your order has been confirmed."
        );

        RuntimeException smtpFailure =
                new RuntimeException("SMTP unavailable");

        doThrow(smtpFailure)
                .when(emailNotificationSender)
                .send(message);

        assertThatThrownBy(
                () -> notificationWorker.processNotification(message)
        )
                .isInstanceOf(RuntimeException.class)
                .hasMessage(
                        "Notification delivery failed for notificationId="
                                + notificationId
                )
                .hasCause(smtpFailure);

        verify(emailNotificationSender).send(message);

        verify(smsNotificationSender, never())
                .send(message);

        verify(notificationService, never())
                .markNotificationAsSent(notificationId);
    }
}

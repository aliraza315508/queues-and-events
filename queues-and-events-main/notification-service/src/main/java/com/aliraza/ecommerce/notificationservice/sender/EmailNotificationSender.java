package com.aliraza.ecommerce.notificationservice.sender;

import com.aliraza.ecommerce.notificationservice.message.NotificationMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class EmailNotificationSender {

    private final JavaMailSender javaMailSender;
    private final boolean emailEnabled;
    private final String fromEmail;

    public EmailNotificationSender(
            JavaMailSender javaMailSender,
            @Value("${app.notification.email.enabled}") boolean emailEnabled,
            @Value("${app.notification.email.from}") String fromEmail
    ) {
        this.javaMailSender = javaMailSender;
        this.emailEnabled = emailEnabled;
        this.fromEmail = fromEmail;
    }

    public void send(NotificationMessage notificationMessage) {
        if (!emailEnabled) {
            return;
        }

        if (!StringUtils.hasText(notificationMessage.recipientEmail())) {
            return;
        }

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setFrom(fromEmail);
        mailMessage.setTo(notificationMessage.recipientEmail());
        mailMessage.setSubject(notificationMessage.subject());
        mailMessage.setText(notificationMessage.message());

        javaMailSender.send(mailMessage);
    }
}
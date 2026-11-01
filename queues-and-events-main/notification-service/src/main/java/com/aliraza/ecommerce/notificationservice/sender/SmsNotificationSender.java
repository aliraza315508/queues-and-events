package com.aliraza.ecommerce.notificationservice.sender;

import com.aliraza.ecommerce.notificationservice.message.NotificationMessage;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

@Component
public class SmsNotificationSender {

    private final boolean smsEnabled;
    private final String fromPhoneNumber;

    public SmsNotificationSender(
            @Value("${app.notification.sms.enabled}") boolean smsEnabled,
            @Value("${twilio.account-sid}") String accountSid,
            @Value("${twilio.auth-token}") String authToken,
            @Value("${twilio.from-phone-number}") String fromPhoneNumber
    ) {
        this.smsEnabled = smsEnabled;
        this.fromPhoneNumber = fromPhoneNumber;

        if (smsEnabled) {
            Twilio.init(accountSid, authToken);
        }
    }

    public void send(NotificationMessage notificationMessage) {
        if (!smsEnabled) {
            return;
        }

        if (!StringUtils.hasText(notificationMessage.recipientPhone())) {
            return;
        }

        Message.creator(
                new PhoneNumber(notificationMessage.recipientPhone()),
                new PhoneNumber(fromPhoneNumber),
                notificationMessage.message()
        ).create();
    }
}
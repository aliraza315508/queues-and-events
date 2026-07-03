package com.aliraza.ecommerce.paymentservice.producer;

import com.aliraza.ecommerce.paymentservice.event.PaymentCompletedEvent;
import com.aliraza.ecommerce.paymentservice.event.PaymentFailedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class PaymentEventProducer {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventProducer.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final String paymentCompletedTopic;
    private final String paymentFailedTopic;

    public PaymentEventProducer(
            KafkaTemplate<String, Object> kafkaTemplate,
            @Value("${app.kafka.topics.payment-completed}") String paymentCompletedTopic,
            @Value("${app.kafka.topics.payment-failed}") String paymentFailedTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.paymentCompletedTopic = paymentCompletedTopic;
        this.paymentFailedTopic = paymentFailedTopic;
    }

    public void publishPaymentCompleted(PaymentCompletedEvent event) {
        kafkaTemplate.send(
                paymentCompletedTopic,
                event.orderId().toString(),
                event
        ).whenComplete((result, exception) -> {
            if (exception != null) {
                log.error(
                        "Failed to publish PaymentCompletedEvent for orderId={}",
                        event.orderId(),
                        exception
                );
                return;
            }

            log.info(
                    "Published PaymentCompletedEvent to topic={} partition={} offset={} orderId={}",
                    result.getRecordMetadata().topic(),
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset(),
                    event.orderId()
            );
        });
    }

    public void publishPaymentFailed(PaymentFailedEvent event) {
        kafkaTemplate.send(
                paymentFailedTopic,
                event.orderId().toString(),
                event
        ).whenComplete((result, exception) -> {
            if (exception != null) {
                log.error(
                        "Failed to publish PaymentFailedEvent for orderId={}",
                        event.orderId(),
                        exception
                );
                return;
            }

            log.info(
                    "Published PaymentFailedEvent to topic={} partition={} offset={} orderId={} reason={}",
                    result.getRecordMetadata().topic(),
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset(),
                    event.orderId(),
                    event.reason()
            );
        });
    }
}
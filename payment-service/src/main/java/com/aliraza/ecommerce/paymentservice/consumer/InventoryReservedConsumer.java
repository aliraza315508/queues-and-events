package com.aliraza.ecommerce.paymentservice.consumer;

import com.aliraza.ecommerce.paymentservice.dto.PaymentRequest;
import com.aliraza.ecommerce.paymentservice.dto.PaymentResponse;
import com.aliraza.ecommerce.paymentservice.event.InventoryReservedEvent;
import com.aliraza.ecommerce.paymentservice.event.PaymentCompletedEvent;
import com.aliraza.ecommerce.paymentservice.event.PaymentFailedEvent;
import com.aliraza.ecommerce.paymentservice.producer.PaymentEventProducer;
import com.aliraza.ecommerce.paymentservice.service.PaymentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class InventoryReservedConsumer {

    private static final Logger log = LoggerFactory.getLogger(InventoryReservedConsumer.class);
    private static final String DEFAULT_PAYMENT_METHOD = "CARD";

    private final PaymentService paymentService;
    private final PaymentEventProducer paymentEventProducer;

    public InventoryReservedConsumer(
            PaymentService paymentService,
            PaymentEventProducer paymentEventProducer
    ) {
        this.paymentService = paymentService;
        this.paymentEventProducer = paymentEventProducer;
    }

    @KafkaListener(
            topics = "${app.kafka.topics.inventory-reserved}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consumeInventoryReserved(InventoryReservedEvent event) {
        log.info(
                "Received InventoryReservedEvent orderId={} customerId={} amount={}",
                event.orderId(),
                event.customerId(),
                event.totalAmount()
        );

        try {
            PaymentResponse payment = paymentService.createAndCompletePayment(
                    new PaymentRequest(
                            event.orderId().toString(),
                            event.customerId(),
                            event.totalAmount(),
                            DEFAULT_PAYMENT_METHOD
                    )
            );

            PaymentCompletedEvent completedEvent = new PaymentCompletedEvent(
                    UUID.randomUUID(),
                    event.orderId(),
                    event.customerId(),
                    payment.id(),
                    payment.amount(),
                    payment.paymentMethod(),
                    Instant.now()
            );

            paymentEventProducer.publishPaymentCompleted(completedEvent);

        } catch (Exception exception) {
            String reason = exception.getMessage();

            PaymentFailedEvent failedEvent = new PaymentFailedEvent(
                    UUID.randomUUID(),
                    event.orderId(),
                    event.customerId(),
                    event.totalAmount(),
                    DEFAULT_PAYMENT_METHOD,
                    reason,
                    Instant.now()
            );

            paymentEventProducer.publishPaymentFailed(failedEvent);

            log.warn(
                    "Payment failed for orderId={} reason={}",
                    event.orderId(),
                    reason
            );
        }
    }
}

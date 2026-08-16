package com.aliraza.ecommerce.orderservice.consumer;

import com.aliraza.ecommerce.orderservice.event.PaymentCompletedEvent;
import com.aliraza.ecommerce.orderservice.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class PaymentCompletedConsumer {

    private static final Logger log = LoggerFactory.getLogger(PaymentCompletedConsumer.class);

    private final ObjectMapper objectMapper;
    private final OrderService orderService;

    public PaymentCompletedConsumer(ObjectMapper objectMapper, OrderService orderService) {
        this.objectMapper = objectMapper;
        this.orderService = orderService;
    }

    @KafkaListener(
            topics = "${app.kafka.topics.payment-completed}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String message) throws Exception {
        PaymentCompletedEvent event = objectMapper.readValue(message, PaymentCompletedEvent.class);

        log.info(
                "Consumed PaymentCompletedEvent for orderId={} paymentId={}",
                event.orderId(),
                event.paymentId()
        );

        orderService.confirmOrder(event.orderId());
    }
}

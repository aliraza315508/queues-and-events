package com.aliraza.ecommerce.orderservice.consumer;

import com.aliraza.ecommerce.orderservice.event.PaymentFailedEvent;
import com.aliraza.ecommerce.orderservice.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class PaymentFailedConsumer {

    private static final Logger log = LoggerFactory.getLogger(PaymentFailedConsumer.class);

    private final ObjectMapper objectMapper;
    private final OrderService orderService;

    public PaymentFailedConsumer(ObjectMapper objectMapper, OrderService orderService) {
        this.objectMapper = objectMapper;
        this.orderService = orderService;
    }

    @KafkaListener(
            topics = "${app.kafka.topics.payment-failed}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String message) throws Exception {
        PaymentFailedEvent event = objectMapper.readValue(message, PaymentFailedEvent.class);

        log.info(
                "Consumed PaymentFailedEvent for orderId={} reason={}",
                event.orderId(),
                event.reason()
        );

        orderService.cancelOrder(event.orderId(), event.reason());
    }
}

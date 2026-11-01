package com.aliraza.ecommerce.orderservice.producer;

import com.aliraza.ecommerce.orderservice.event.OrderCancelledEvent;
import com.aliraza.ecommerce.orderservice.event.OrderConfirmedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderStatusEventProducer {

    private static final Logger log = LoggerFactory.getLogger(OrderStatusEventProducer.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final String orderConfirmedTopic;
    private final String orderCancelledTopic;

    public OrderStatusEventProducer(
            KafkaTemplate<String, Object> kafkaTemplate,
            @Value("${app.kafka.topics.order-confirmed}") String orderConfirmedTopic,
            @Value("${app.kafka.topics.order-cancelled}") String orderCancelledTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.orderConfirmedTopic = orderConfirmedTopic;
        this.orderCancelledTopic = orderCancelledTopic;
    }

    public void publishOrderConfirmed(OrderConfirmedEvent event) {
        kafkaTemplate.send(
                orderConfirmedTopic,
                event.orderId().toString(),
                event
        ).whenComplete((result, exception) -> {
            if (exception != null) {
                log.error("Failed to publish OrderConfirmedEvent for orderId={}", event.orderId(), exception);
                return;
            }

            log.info(
                    "Published OrderConfirmedEvent to topic={} partition={} offset={} orderId={}",
                    result.getRecordMetadata().topic(),
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset(),
                    event.orderId()
            );
        });
    }

    public void publishOrderCancelled(OrderCancelledEvent event) {
        kafkaTemplate.send(
                orderCancelledTopic,
                event.orderId().toString(),
                event
        ).whenComplete((result, exception) -> {
            if (exception != null) {
                log.error("Failed to publish OrderCancelledEvent for orderId={}", event.orderId(), exception);
                return;
            }

            log.info(
                    "Published OrderCancelledEvent to topic={} partition={} offset={} orderId={} reason={}",
                    result.getRecordMetadata().topic(),
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset(),
                    event.orderId(),
                    event.reason()
            );
        });
    }
}

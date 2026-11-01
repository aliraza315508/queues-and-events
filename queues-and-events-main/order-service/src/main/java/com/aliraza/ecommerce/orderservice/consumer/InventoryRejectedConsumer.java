package com.aliraza.ecommerce.orderservice.consumer;

import com.aliraza.ecommerce.orderservice.event.InventoryRejectedEvent;
import com.aliraza.ecommerce.orderservice.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class InventoryRejectedConsumer {

    private static final Logger log = LoggerFactory.getLogger(InventoryRejectedConsumer.class);

    private final ObjectMapper objectMapper;
    private final OrderService orderService;

    public InventoryRejectedConsumer(ObjectMapper objectMapper, OrderService orderService) {
        this.objectMapper = objectMapper;
        this.orderService = orderService;
    }

    @KafkaListener(
            topics = "${app.kafka.topics.inventory-rejected}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consume(String message) throws Exception {
        InventoryRejectedEvent event = objectMapper.readValue(message, InventoryRejectedEvent.class);

        log.info(
                "Consumed InventoryRejectedEvent for orderId={} productId={} reason={}",
                event.orderId(),
                event.productId(),
                event.reason()
        );

        orderService.cancelOrder(event.orderId(), event.reason());
    }
}

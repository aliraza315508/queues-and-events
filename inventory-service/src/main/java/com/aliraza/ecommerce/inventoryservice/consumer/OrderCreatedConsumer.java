package com.aliraza.ecommerce.inventoryservice.consumer;

import com.aliraza.ecommerce.inventoryservice.dto.UpdateStockRequest;
import com.aliraza.ecommerce.inventoryservice.event.InventoryRejectedEvent;
import com.aliraza.ecommerce.inventoryservice.event.InventoryReservedEvent;
import com.aliraza.ecommerce.inventoryservice.event.OrderCreatedEvent;
import com.aliraza.ecommerce.inventoryservice.producer.InventoryEventProducer;
import com.aliraza.ecommerce.inventoryservice.service.InventoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class OrderCreatedConsumer {

    private static final Logger log = LoggerFactory.getLogger(OrderCreatedConsumer.class);

    private final InventoryService inventoryService;
    private final InventoryEventProducer inventoryEventProducer;

    public OrderCreatedConsumer(
            InventoryService inventoryService,
            InventoryEventProducer inventoryEventProducer
    ) {
        this.inventoryService = inventoryService;
        this.inventoryEventProducer = inventoryEventProducer;
    }

    @KafkaListener(
            topics = "${app.kafka.topics.order-created}",
            groupId = "${spring.kafka.consumer.group-id}"
    )
    public void consumeOrderCreated(OrderCreatedEvent event) {
        log.info(
                "Received OrderCreatedEvent orderId={} productId={} quantity={}",
                event.orderId(),
                event.productId(),
                event.quantity()
        );

        try {
            inventoryService.reserveStock(
                    event.productId(),
                    new UpdateStockRequest(event.quantity())
            );

            InventoryReservedEvent reservedEvent = new InventoryReservedEvent(
                    UUID.randomUUID(),
                    event.orderId(),
                    event.customerId(),
                    event.productId(),
                    event.quantity(),
                    Instant.now()
            );

            inventoryEventProducer.publishInventoryReserved(reservedEvent);

        } catch (Exception exception) {
            String reason = exception.getMessage();

            InventoryRejectedEvent rejectedEvent = new InventoryRejectedEvent(
                    UUID.randomUUID(),
                    event.orderId(),
                    event.customerId(),
                    event.productId(),
                    event.quantity(),
                    reason,
                    Instant.now()
            );

            inventoryEventProducer.publishInventoryRejected(rejectedEvent);

            log.warn(
                    "Inventory rejected for orderId={} productId={} reason={}",
                    event.orderId(),
                    event.productId(),
                    reason
            );
        }
    }
}
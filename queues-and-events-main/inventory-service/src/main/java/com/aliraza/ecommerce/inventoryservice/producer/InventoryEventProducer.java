package com.aliraza.ecommerce.inventoryservice.producer;

import com.aliraza.ecommerce.inventoryservice.event.InventoryRejectedEvent;
import com.aliraza.ecommerce.inventoryservice.event.InventoryReservedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class InventoryEventProducer {

    private static final Logger log = LoggerFactory.getLogger(InventoryEventProducer.class);

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final String inventoryReservedTopic;
    private final String inventoryRejectedTopic;

    public InventoryEventProducer(
            KafkaTemplate<String, Object> kafkaTemplate,
            @Value("${app.kafka.topics.inventory-reserved}") String inventoryReservedTopic,
            @Value("${app.kafka.topics.inventory-rejected}") String inventoryRejectedTopic
    ) {
        this.kafkaTemplate = kafkaTemplate;
        this.inventoryReservedTopic = inventoryReservedTopic;
        this.inventoryRejectedTopic = inventoryRejectedTopic;
    }

    public void publishInventoryReserved(InventoryReservedEvent event) {
        kafkaTemplate.send(
                inventoryReservedTopic,
                event.orderId().toString(),
                event
        ).whenComplete((result, exception) -> {
            if (exception != null) {
                log.error(
                        "Failed to publish InventoryReservedEvent for orderId={}",
                        event.orderId(),
                        exception
                );
                return;
            }

            log.info(
                    "Published InventoryReservedEvent to topic={} partition={} offset={} orderId={}",
                    result.getRecordMetadata().topic(),
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset(),
                    event.orderId()
            );
        });
    }

    public void publishInventoryRejected(InventoryRejectedEvent event) {
        kafkaTemplate.send(
                inventoryRejectedTopic,
                event.orderId().toString(),
                event
        ).whenComplete((result, exception) -> {
            if (exception != null) {
                log.error(
                        "Failed to publish InventoryRejectedEvent for orderId={}",
                        event.orderId(),
                        exception
                );
                return;
            }

            log.info(
                    "Published InventoryRejectedEvent to topic={} partition={} offset={} orderId={} reason={}",
                    result.getRecordMetadata().topic(),
                    result.getRecordMetadata().partition(),
                    result.getRecordMetadata().offset(),
                    event.orderId(),
                    event.reason()
            );
        });
    }
}

package com.aliraza.ecommerce.inventoryservice.consumer;

import com.aliraza.ecommerce.inventoryservice.dto.UpdateStockRequest;
import com.aliraza.ecommerce.inventoryservice.event.InventoryReservedEvent;
import com.aliraza.ecommerce.inventoryservice.event.OrderCreatedEvent;
import com.aliraza.ecommerce.inventoryservice.producer.InventoryEventProducer;
import com.aliraza.ecommerce.inventoryservice.service.InventoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class OrderCreatedConsumerTest {

    private InventoryService inventoryService;
    private InventoryEventProducer inventoryEventProducer;
    private OrderCreatedConsumer orderCreatedConsumer;

    @BeforeEach
    void setUp() {

        inventoryService = mock(InventoryService.class);
        inventoryEventProducer = mock(InventoryEventProducer.class);

        orderCreatedConsumer = new OrderCreatedConsumer(
                inventoryService,
                inventoryEventProducer
        );
    }

    @Test
    void technicalFailureIsRethrownForKafkaRetry() {

        UUID orderId = UUID.randomUUID();

        OrderCreatedEvent event = new OrderCreatedEvent(
                UUID.randomUUID(),
                orderId,
                "customer-123",
                "product-123",
                2,
                new BigDecimal("25.00"),
                new BigDecimal("50.00"),
                Instant.now()
        );

        RuntimeException databaseFailure =
                new RuntimeException("Database unavailable");

        when(
                inventoryService.reserveStock(
                        event.productId(),
                        new UpdateStockRequest(event.quantity())
                )
        ).thenThrow(databaseFailure);

        assertThatThrownBy(
                () -> orderCreatedConsumer.consumeOrderCreated(event)
        )
                .isSameAs(databaseFailure);

        verify(inventoryService)
                .reserveStock(
                        event.productId(),
                        new UpdateStockRequest(event.quantity())
                );

        verifyNoInteractions(inventoryEventProducer);
    }

    @Test
    void kafkaPublishFailureIsRethrownForKafkaRetry() {

        OrderCreatedEvent event = new OrderCreatedEvent(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "customer-123",
                "product-123",
                2,
                new BigDecimal("25.00"),
                new BigDecimal("50.00"),
                Instant.now()
        );

        RuntimeException kafkaFailure =
                new RuntimeException("Kafka unavailable");

        doThrow(kafkaFailure)
                .when(inventoryEventProducer)
                .publishInventoryReserved(any());

        assertThatThrownBy(
                () -> orderCreatedConsumer.consumeOrderCreated(event)
        )
                .isSameAs(kafkaFailure);

        verify(inventoryService)
                .reserveStock(
                        event.productId(),
                        new UpdateStockRequest(event.quantity())
                );

        verify(inventoryEventProducer)
                .publishInventoryReserved(any());

        verify(inventoryEventProducer, never())
                .publishInventoryRejected(any());
    }

    @Test
    void successfulReservationPublishesInventoryReserved() {

        OrderCreatedEvent event = new OrderCreatedEvent(
                UUID.randomUUID(),
                UUID.randomUUID(),
                "customer-123",
                "product-123",
                2,
                new BigDecimal("25.00"),
                new BigDecimal("50.00"),
                Instant.now()
        );

        orderCreatedConsumer.consumeOrderCreated(event);

        ArgumentCaptor<InventoryReservedEvent> reservedEventCaptor =
                ArgumentCaptor.forClass(InventoryReservedEvent.class);

        verify(inventoryService)
                .reserveStock(
                        event.productId(),
                        new UpdateStockRequest(event.quantity())
                );

        verify(inventoryEventProducer)
                .publishInventoryReserved(
                        reservedEventCaptor.capture()
                );

        verify(inventoryEventProducer, never())
                .publishInventoryRejected(any());

        InventoryReservedEvent reservedEvent =
                reservedEventCaptor.getValue();

        assertThat(reservedEvent.orderId())
                .isEqualTo(event.orderId());

        assertThat(reservedEvent.customerId())
                .isEqualTo(event.customerId());

        assertThat(reservedEvent.productId())
                .isEqualTo(event.productId());

        assertThat(reservedEvent.quantity())
                .isEqualTo(event.quantity());

        assertThat(reservedEvent.totalAmount())
                .isEqualByComparingTo(event.totalAmount());
    }
}
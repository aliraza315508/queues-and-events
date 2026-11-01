package com.aliraza.ecommerce.inventoryservice;

import com.aliraza.ecommerce.inventoryservice.event.OrderCreatedEvent;
import com.aliraza.ecommerce.inventoryservice.model.Inventory;
import com.aliraza.ecommerce.inventoryservice.repository.InventoryRepository;
import com.aliraza.ecommerce.inventoryservice.service.InventoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.kafka.KafkaContainer;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;

@Testcontainers
@SpringBootTest
public class InventoryKafkaIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres =
            new PostgreSQLContainer<>("postgres:17-alpine")
                    .withDatabaseName("inventory_test")
                    .withUsername("test")
                    .withPassword("test");


    @Container
    static KafkaContainer kafka =
            new KafkaContainer("apache/kafka:4.1.2") ;

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry){

        registry.add(
                "spring.datasource.url",
                postgres::getJdbcUrl
        );

        registry.add(
                "spring.datasource.username",
                postgres::getUsername
        );

        registry.add(
                "spring.datasource.password",
                postgres::getPassword
        );

        registry.add(
                "spring.kafka.bootstrap-servers",
                kafka::getBootstrapServers
        );
    }


    @Autowired
    private InventoryRepository inventoryRepository ;

    @Autowired
    private KafkaTemplate<String , Object> kafkaTemplate ;

    @Test
    void shouldConsumerOrderCreatedAndReserveInventory() {


        String productId = "kafka-test-product" ;

        Inventory inventory =
                new Inventory(productId, 10);

        inventoryRepository.saveAndFlush(inventory);

        UUID orderId = UUID.randomUUID();

        OrderCreatedEvent event = new OrderCreatedEvent(
           UUID.randomUUID() ,
           orderId ,
           "test-customer" ,
           productId ,
           3 ,
                new BigDecimal("25.00"),
                new BigDecimal("75.00"),
                Instant.now()
        ) ;

        kafkaTemplate.send("order.created" ,
                orderId.toString() ,
                event) ;

        await()
                .atMost(Duration.ofSeconds(10))
                .untilAsserted(() -> {
            Inventory updated =
                    inventoryRepository.findByProductId(productId)
                            .orElseThrow() ;

            assertThat(
                    updated.getAvailableQuantity()
            ).isEqualTo(7) ;


                    assertThat(
                            updated.getReservedQuantity()
                    ).isEqualTo(3);
        });
    }
}

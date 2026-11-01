package com.aliraza.ecommerce.inventoryservice;

import com.aliraza.ecommerce.inventoryservice.model.Inventory;
import com.aliraza.ecommerce.inventoryservice.repository.InventoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@DataJpaTest
@AutoConfigureTestDatabase(
        replace = AutoConfigureTestDatabase.Replace.NONE
)
public class InventoryRepositoryIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgreSQLContainer
            = new PostgreSQLContainer<>("postgres:17-alpine")
            .withDatabaseName("inventory-test")
            .withUsername("test")
            .withPassword("test");


    @Autowired
    private InventoryRepository inventoryRepository;

    @Test
    void shouldSaveAndLoadInventoryUsingRealPostgres() {

        Inventory inventory =
                new Inventory("test-product-001", 10);

        Inventory saved =
                inventoryRepository.saveAndFlush(inventory);

        Inventory loaded =
                inventoryRepository
                        .findByProductId("test-product-001")
                        .orElseThrow();

        assertThat(saved.getId()).isNotNull();

        assertThat(loaded.getProductId())
                .isEqualTo("test-product-001");

        assertThat(loaded.getAvailableQuantity())
                .isEqualTo(10);

        assertThat(loaded.getReservedQuantity())
                .isZero();

        assertThat(loaded.getCreatedAt())
                .isNotNull();

        assertThat(loaded.getUpdatedAt())
                .isNotNull();
    }

}

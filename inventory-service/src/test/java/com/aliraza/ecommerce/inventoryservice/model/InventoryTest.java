package com.aliraza.ecommerce.inventoryservice.model;

import com.aliraza.ecommerce.inventoryservice.exception.InsufficientStockException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

public class InventoryTest {

    @Test
    void reserveStock_whenEnoughStock_movesStockFromAvailableToReserved() {

        Inventory inventory = new Inventory(
                "product-123",
                10
        );

        inventory.reserveStock(2);

        assertThat(inventory.getAvailableQuantity())
                .isEqualTo(8);

        assertThat(inventory.getReservedQuantity())
                .isEqualTo(2);
    }

    @Test
    void reserveStock_whenNotEnoughStock_throwsInsufficientStockException() {

        Inventory inventory = new Inventory(
                "product-123",
                5
        );

        assertThatThrownBy(() -> inventory.reserveStock(10))
                .isInstanceOf(InsufficientStockException.class)
                .hasMessage("Not enough stock available");

        assertThat(inventory.getAvailableQuantity())
                .isEqualTo(5);

        assertThat(inventory.getReservedQuantity())
                .isZero();
    }

    @Test
    void releaseReservedStock_whenEnoughReservedStock_movesStockBackToAvailable() {

        Inventory inventory = new Inventory(
                "product-123",
                10
        );

        inventory.reserveStock(4);

        inventory.releaseReservedStock(2);

        assertThat(inventory.getAvailableQuantity())
                .isEqualTo(8);

        assertThat(inventory.getReservedQuantity())
                .isEqualTo(2);
    }
}

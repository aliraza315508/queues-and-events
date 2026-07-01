package com.aliraza.ecommerce.inventoryservice.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @Column(name = "id", nullable = false, updatable = false, columnDefinition = "uuid")
    private UUID id;

    @Column(name = "product_id", nullable = false, unique = true, length = 100)
    private String productId;

    @Column(name = "available_quantity", nullable = false)
    private Integer availableQuantity;

    @Column(name = "reserved_quantity", nullable = false)
    private Integer reservedQuantity;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Inventory() {
    }

    public Inventory(String productId, Integer availableQuantity) {
        this.productId = productId;
        this.availableQuantity = availableQuantity;
        this.reservedQuantity = 0;
    }

    @PrePersist
    void prePersist() {
        Instant now = Instant.now();

        if (id == null) {
            id = UUID.randomUUID();
        }

        if (availableQuantity == null) {
            availableQuantity = 0;
        }

        if (reservedQuantity == null) {
            reservedQuantity = 0;
        }

        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = Instant.now();
    }

    public boolean hasEnoughStock(Integer quantity) {
        return quantity != null && quantity > 0 && availableQuantity >= quantity;
    }

    public void addStock(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("quantity must be greater than 0");
        }

        availableQuantity += quantity;
    }

    public void reserveStock(Integer quantity) {
        if (!hasEnoughStock(quantity)) {
            throw new IllegalArgumentException("Not enough stock available");
        }

        availableQuantity -= quantity;
        reservedQuantity += quantity;
    }

    public void releaseReservedStock(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("quantity must be greater than 0");
        }

        if (reservedQuantity < quantity) {
            throw new IllegalArgumentException("Not enough reserved stock to release");
        }

        reservedQuantity -= quantity;
        availableQuantity += quantity;
    }

    public void confirmReservedStock(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("quantity must be greater than 0");
        }

        if (reservedQuantity < quantity) {
            throw new IllegalArgumentException("Not enough reserved stock to confirm");
        }

        reservedQuantity -= quantity;
    }

    public UUID getId() {
        return id;
    }

    public String getProductId() {
        return productId;
    }

    public Integer getAvailableQuantity() {
        return availableQuantity;
    }

    public Integer getReservedQuantity() {
        return reservedQuantity;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }
}

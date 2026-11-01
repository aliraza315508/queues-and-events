package com.aliraza.ecommerce.inventoryservice.exception;

public abstract class InventoryBusinessException extends RuntimeException {

    protected InventoryBusinessException(String message) {
        super(message);
    }
}

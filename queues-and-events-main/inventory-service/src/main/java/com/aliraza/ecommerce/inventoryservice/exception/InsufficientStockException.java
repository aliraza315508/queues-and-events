package com.aliraza.ecommerce.inventoryservice.exception;

public class InsufficientStockException extends InventoryBusinessException {

    public InsufficientStockException(String message) {
        super(message);
    }
}

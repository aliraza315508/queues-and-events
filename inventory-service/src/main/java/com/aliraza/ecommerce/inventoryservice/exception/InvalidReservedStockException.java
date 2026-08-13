package com.aliraza.ecommerce.inventoryservice.exception;

public class InvalidReservedStockException extends InventoryBusinessException {

    public InvalidReservedStockException(String message) {
        super(message);
    }
}

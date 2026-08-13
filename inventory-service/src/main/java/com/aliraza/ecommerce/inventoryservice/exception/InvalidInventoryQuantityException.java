package com.aliraza.ecommerce.inventoryservice.exception;

public class InvalidInventoryQuantityException extends InventoryBusinessException {

    public InvalidInventoryQuantityException(String message) {
        super(message);
    }
}

package com.aliraza.ecommerce.inventoryservice.exception;

public class InventoryNotFoundException extends InventoryBusinessException {

    public InventoryNotFoundException(String message) {
        super(message);
    }
}

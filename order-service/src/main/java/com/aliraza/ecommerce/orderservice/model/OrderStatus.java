package com.aliraza.ecommerce.orderservice.model;

public enum OrderStatus {
    CREATED,
    INVENTORY_RESERVED,
    INVENTORY_REJECTED,
    PAYMENT_COMPLETED,
    PAYMENT_FAILED,
    CONFIRMED,
    CANCELLED
}

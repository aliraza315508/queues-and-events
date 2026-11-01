package com.aliraza.ecommerce.paymentservice.exception;

public abstract class PaymentBusinessException extends RuntimeException {

    protected PaymentBusinessException(String message) {
        super(message);
    }
}
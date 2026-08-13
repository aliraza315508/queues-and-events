package com.aliraza.ecommerce.paymentservice.exception;

public class InvalidPaymentStateException extends PaymentBusinessException {

    public InvalidPaymentStateException(String message) {
        super(message);
    }
}